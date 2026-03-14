import { Injectable, signal } from '@angular/core';
import type { VideoMeta } from '../types/video.types';

@Injectable({ providedIn: 'root' })
export class FFmpegService {
  private ffmpeg: unknown = null;
  private isLoaded = signal(false);
  private isLoading = signal(false);
  private loadPromise: Promise<void> | null = null;

  async load(): Promise<void> {
    if (this.isLoaded()) return;
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = this._doLoad();
    return this.loadPromise;
  }

  private async _doLoad(): Promise<void> {
    try {
      this.isLoading.set(true);

      // SharedArrayBuffer guard — required for FFmpeg WASM
      if (typeof SharedArrayBuffer === 'undefined') {
        throw new Error(
          'SharedArrayBuffer is NOT available. ' +
          'Ensure COOP/COEP headers are set: Cross-Origin-Opener-Policy: same-origin, ' +
          'Cross-Origin-Embedder-Policy: require-corp'
        );
      }

      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');
      const ff = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

      // 15-second Timeout Watchdog (Phase 18 stability requirement)
      const loadWithTimeout = Promise.race([
        ff.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('FFmpeg WASM load timed out after 15s')), 15000)
        ),
      ]);

      await loadWithTimeout;
      this.ffmpeg = ff;
      this.isLoaded.set(true);
    } catch (err) {
      this.loadPromise = null;
      throw err instanceof Error ? err : new Error('FFMPEG_LOAD_FAILED');
    } finally {
      this.isLoading.set(false);
    }
  }

  async getMetadata(file: File): Promise<VideoMeta> {
    await this.load();
    const ff = this.ffmpeg as { writeFile: (name: string, data: Uint8Array) => Promise<void>; on: (event: string, cb: (info: Record<string, unknown>) => void) => void; exec: (args: string[]) => Promise<void>; deleteFile: (name: string) => void; readFile: (name: string) => Promise<Uint8Array> };
    const { fetchFile } = await import('@ffmpeg/util');
    const inputName = `meta_${Date.now()}.mp4`;
    try {
      ff.writeFile(inputName, await fetchFile(file));
      let output = '';
      ff.on('log', ({ message }: Record<string, unknown>) => { output += String(message ?? '') + '\n'; });
      try { await ff.exec(['-i', inputName, '-f', 'null', '/dev/null']); } catch { /* ffprobe always errors */ }
      return this._parseMetaFromLog(output, file);
    } finally {
      try { ff.deleteFile(inputName); } catch { /**/ }
    }
  }

  private _parseMetaFromLog(log: string, file: File): VideoMeta {
    const durMatch = log.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    const duration = durMatch ? parseInt(durMatch[1])*3600 + parseInt(durMatch[2])*60 + parseFloat(durMatch[3]) : 0;
    const resMatch = log.match(/(\d{2,5})x(\d{2,5})/);
    const width = resMatch ? parseInt(resMatch[1]) : 0;
    const height = resMatch ? parseInt(resMatch[2]) : 0;
    const fpsMatch = log.match(/(\d+(?:\.\d+)?)\s*fps/);
    const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 30;
    const videoCodecMatch = log.match(/Video:\s*(\w+)/);
    const codec = videoCodecMatch ? videoCodecMatch[1] : 'unknown';
    const audioCodecMatch = log.match(/Audio:\s*(\w+)/);
    const audioCodec = audioCodecMatch ? audioCodecMatch[1] : null;
    const bitrateMatch = log.match(/bitrate:\s*(\d+)\s*kb\/s/);
    const videoBitrate = bitrateMatch ? parseInt(bitrateMatch[1]) : 0;
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g = (width && height) ? gcd(width, height) : 1;
    const aspectRatio = (width && height) ? `${width/g}:${height/g}` : '16:9';
    return {
      filename: file.name, fileSizeMB: file.size/1_048_576, duration, width, height, fps,
      codec, audioCodec, audioBitrate: 128, videoBitrate, bitrate: videoBitrate, sampleRate: 44100, hasAudio: !!audioCodec, aspectRatio
    };
  }

  async runCommand(args: string[], onProgress?: (p: number) => void): Promise<Uint8Array> {
    await this.load();
    const ff = this.ffmpeg as { on: (event: string, cb: (info: Record<string, unknown>) => void) => void; exec: (args: string[]) => Promise<void>; readFile: (name: string) => Promise<Uint8Array>; deleteFile: (name: string) => void };
    if (onProgress) ff.on('progress', ({ progress }: Record<string, unknown>) => { onProgress(Math.min(Math.round(Number(progress)*100), 99)); });
    await ff.exec(args);
    const outputName = args[args.length - 1];
    try { return await ff.readFile(outputName) as Uint8Array; } catch { return new Uint8Array(0); }
  }

  deleteFile(name: string): void {
    if (!this.ffmpeg) return;
    try { (this.ffmpeg as { deleteFile: (name: string) => void }).deleteFile(name); } catch { /**/ }
  }

  isReady() { return this.isLoaded.asReadonly(); }
}
