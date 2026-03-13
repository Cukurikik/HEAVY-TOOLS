// ============================================================
// FFMPEG SERVICE — Singleton WASM engine
// File: src/app/modules/video/shared/engine/ffmpeg.service.ts
// ============================================================

import { Injectable, signal } from '@angular/core';
import type { VideoMeta } from '../types/video.types';
import { VideoErrorMessages } from '../errors/video.errors';

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
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');

      const ff = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

      await ff.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      this.ffmpeg = ff;
      this.isLoaded.set(true);
    } catch (err) {
      this.loadPromise = null;
      throw new Error(VideoErrorMessages['FFMPEG_LOAD_FAILED']);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getMetadata(file: File): Promise<VideoMeta> {
    await this.load();
    const ff = this.ffmpeg as any;
    const { fetchFile } = await import('@ffmpeg/util');

    const inputName = `input_${Date.now()}_${file.name}`;
    try {
      ff.writeFile(inputName, await fetchFile(file));

      let output = '';
      ff.on('log', ({ message }: any) => { output += message + '\n'; });

      // Run ffprobe via ffmpeg stderr
      await ff.exec(['-i', inputName, '-f', 'null', '/dev/null']).catch(() => {});

      return this._parseMetaFromLog(output, file);
    } finally {
      try { ff.deleteFile(inputName); } catch { /* ignore */ }
    }
  }

  private _parseMetaFromLog(log: string, file: File): VideoMeta {
    // Extract duration
    const durMatch = log.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    const duration = durMatch
      ? parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60 + parseFloat(durMatch[3])
      : 0;

    // Extract resolution
    const resMatch = log.match(/(\d{2,5})x(\d{2,5})/);
    const width = resMatch ? parseInt(resMatch[1]) : 0;
    const height = resMatch ? parseInt(resMatch[2]) : 0;

    // Extract fps
    const fpsMatch = log.match(/(\d+(?:\.\d+)?)\s*fps/);
    const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 30;

    // Extract video codec
    const videoCodecMatch = log.match(/Video:\s*(\w+)/);
    const codec = videoCodecMatch ? videoCodecMatch[1] : 'unknown';

    // Extract audio codec
    const audioCodecMatch = log.match(/Audio:\s*(\w+)/);
    const audioCodec = audioCodecMatch ? audioCodecMatch[1] : null;

    const bitrateMatch = log.match(/bitrate:\s*(\d+)\s*kb\/s/);
    const videoBitrate = bitrateMatch ? parseInt(bitrateMatch[1]) : 0;

    const w = width;
    const h = height;
    let aspectRatio = '16:9';
    if (w && h) {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const g = gcd(w, h);
      aspectRatio = `${w / g}:${h / g}`;
    }

    return {
      filename: file.name,
      fileSizeMB: file.size / 1_048_576,
      duration,
      width,
      height,
      fps,
      codec,
      audioCodec,
      audioBitrate: 128,
      videoBitrate,
      hasAudio: !!audioCodec,
      aspectRatio,
    };
  }

  async runCommand(
    args: string[],
    onProgress?: (p: number) => void
  ): Promise<Uint8Array> {
    await this.load();
    const ff = this.ffmpeg as any;

    if (onProgress) {
      ff.on('progress', ({ progress }: any) => {
        onProgress(Math.min(Math.round(progress * 100), 99));
      });
    }

    await ff.exec(args);

    const outputArg = args[args.lastIndexOf('-') + 2] ?? args[args.length - 1];
    const outputName = outputArg ?? 'output';

    let data: Uint8Array;
    try {
      data = await ff.readFile(outputName) as Uint8Array;
    } catch {
      data = new Uint8Array(0);
    }

    return data;
  }

  deleteFile(name: string): void {
    if (!this.ffmpeg) return;
    try { (this.ffmpeg as any).deleteFile(name); } catch { /* ignore */ }
  }

  isReady() {
    return this.isLoaded.asReadonly();
  }
}
