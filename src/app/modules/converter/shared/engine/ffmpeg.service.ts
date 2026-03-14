// ============================================================
// CONVERTER FFMPEG SERVICE — Singleton FFmpeg WASM wrapper
// File: src/app/modules/converter/shared/engine/ffmpeg.service.ts
// ============================================================

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConverterFFmpegService {
  private ffmpegInstance: unknown = null;
  private loadPromise: Promise<void> | null = null;
  readonly isReady = signal(false);

  /** Lazy-load FFmpeg WASM singleton */
  async load(): Promise<void> {
    if (this.ffmpegInstance) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const { FFmpeg } = await import('@ffmpeg/ffmpeg');
        const { toBlobURL } = await import('@ffmpeg/util');
        const ffmpeg = new FFmpeg();

        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm') });

        this.ffmpegInstance = ffmpeg;
        this.isReady.set(true);
      } catch (err) {
        this.loadPromise = null;
        throw new Error('FFmpeg WASM load failed: ' + String(err));
      }
    })();

    return this.loadPromise;
  }

  /** Get underlying FFmpeg instance */
  getInstance(): unknown {
    return this.ffmpegInstance;
  }
}
