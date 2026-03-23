import type { FFmpeg as FFmpegType } from '@ffmpeg/ffmpeg';
const { FFmpeg } = require('@ffmpeg/ffmpeg');

let ffmpegInstance: FFmpegType | null = null;
let loadPromise: Promise<boolean> | null = null;

// ═══════════════════════════════════════════════════
// Track registered listeners by reference so we can
// actually remove them on subsequent calls (BUG FIX:
// .off(() => {}) creates a NEW function ref that
// never matches the old one → memory leak)
// ═══════════════════════════════════════════════════
let currentProgressHandler: ((e: any) => void) | null = null;
let currentLogHandler: ((e: any) => void) | null = null;

export const getFFmpeg = async (onProgress?: (p: number) => void, onLog?: (m: string) => void): Promise<FFmpegType> => {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }

  // Remove PREVIOUS handlers by their actual reference
  if (currentProgressHandler) {
    try { ffmpegInstance!.off('progress', currentProgressHandler); } catch (_) {}
    currentProgressHandler = null;
  }
  if (currentLogHandler) {
    try { ffmpegInstance!.off('log', currentLogHandler); } catch (_) {}
    currentLogHandler = null;
  }

  // Register NEW handlers and store their references
  if (onProgress) {
    currentProgressHandler = ({ progress }: any) => onProgress(progress);
    ffmpegInstance!.on('progress', currentProgressHandler);
  }
  if (onLog) {
    currentLogHandler = ({ message }: any) => onLog(message);
    ffmpegInstance!.on('log', currentLogHandler);
  }

  // Load core exactly once
  if (!ffmpegInstance!.loaded && !loadPromise) {
    const baseURL = window.location.origin + '/ffmpeg';
    
    loadPromise = ffmpegInstance!.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
      workerURL: `${baseURL}/ffmpeg-core.worker.js`,
    }).catch((err: any) => {
      loadPromise = null; // allow retry on failure
      throw err;
    });
  }

  if (loadPromise) {
    await loadPromise;
  }

  return ffmpegInstance!;
};
