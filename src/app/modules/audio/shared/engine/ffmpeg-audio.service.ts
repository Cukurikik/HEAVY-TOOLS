import { Injectable, signal } from '@angular/core';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { AudioMeta } from '../types/audio.types';

@Injectable({ providedIn: 'root' })
export class FFmpegAudioService {
  private ffmpeg: FFmpeg | null = null;
  private loaded = false;
  readonly loading = signal(false);

  async load(): Promise<FFmpeg> {
    if (this.ffmpeg && this.loaded) return this.ffmpeg;
    this.loading.set(true);
    this.ffmpeg = new FFmpeg();
    const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await this.ffmpeg.load({
      coreURL: await toBlobURL(base + '/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await toBlobURL(base + '/ffmpeg-core.wasm', 'application/wasm'),
    });
    this.loaded = true;
    this.loading.set(false);
    return this.ffmpeg;
  }

  async runCommand(args: string[]): Promise<void> {
    const ff = await this.load();
    await ff.exec(args);
  }

  async writeInputFile(name: string, file: File): Promise<void> {
    const ff = await this.load();
    await ff.writeFile(name, await fetchFile(file));
  }

  async readOutputFile(name: string): Promise<Uint8Array> {
    const ff = await this.load();
    const data = await ff.readFile(name);
    return new Uint8Array(data as Uint8Array);
  }

  async deleteFile(name: string): Promise<void> {
    const ff = await this.load();
    await ff.deleteFile(name);
  }

  async getMetadata(file: File): Promise<AudioMeta> {
    const ff = await this.load();
    const inName = 'probe_in';
    await ff.writeFile(inName, await fetchFile(file));
    let log = '';
    ff.on('log', ({ message }) => { log += message + '\n'; });
    try { await ff.exec(['-i', inName, '-f', 'null', '/dev/null']); } catch { /* expected */ }
    await ff.deleteFile(inName);
    const durMatch = log.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    const dur = durMatch
      ? parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60 + parseFloat(durMatch[3])
      : 0;
    const srMatch = log.match(/(\d+)\s*Hz/);
    const sr = srMatch ? parseInt(srMatch[1]) : 44100;
    return {
      filename: file.name, fileSizeMB: file.size / 1048576, duration: dur,
      sampleRate: sr, channels: 2, bitDepth: 16, bitrate: 0,
      codec: 'unknown', hasVideo: false
    };
  }
}
