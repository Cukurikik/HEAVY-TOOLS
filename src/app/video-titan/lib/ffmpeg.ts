'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';


let ffmpeg: FFmpeg | null = null;

export const getFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = window.location.origin + '/ffmpeg';
  await ffmpeg.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    workerURL: `${baseURL}/ffmpeg-core.worker.js`,
    classWorkerURL: `${baseURL}/814.ffmpeg.js`,
  });

  return ffmpeg;
};
