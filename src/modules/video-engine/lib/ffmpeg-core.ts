import type { FFmpeg as FFmpegType } from '@ffmpeg/ffmpeg';
const { FFmpeg } = require('@ffmpeg/ffmpeg');

let ffmpegInstance: FFmpegType | null = null;
let loadPromise: Promise<boolean> | null = null;

export const getFFmpeg = async (onProgress?: (p: number) => void, onLog?: (m: string) => void): Promise<FFmpegType> => {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }

  // Bind fresh event listeners (remove old ones to avoid memory leaks/duplicate logs)
  ffmpegInstance!.off('progress', () => {});
  ffmpegInstance!.off('log', () => {});
  
  if (onProgress) {
    ffmpegInstance!.on('progress', ({ progress }: any) => onProgress(progress));
  }
  if (onLog) {
    ffmpegInstance!.on('log', ({ message }: any) => onLog(message));
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
