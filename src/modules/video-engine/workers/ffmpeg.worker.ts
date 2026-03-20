/**
 * FFmpeg WASM Web Worker
 * Handles all 27 client-side FFmpeg processing tasks off the main thread.
 * Communicates via postMessage for progress, logs, and completion.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function initFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
  });

  return ffmpeg;
}

export interface FFmpegWorkerMessage {
  type: 'PROCESS';
  payload: {
    inputFileName: string;
    inputData: Uint8Array;
    args: string[];
    outputFileName: string;
  };
}

export interface FFmpegWorkerResponse {
  type: 'PROGRESS' | 'LOG' | 'DONE' | 'ERROR';
  progress?: number;
  log?: string;
  outputData?: Uint8Array;
  outputFileName?: string;
  error?: string;
}

self.onmessage = async (e: MessageEvent<FFmpegWorkerMessage>) => {
  const { type, payload } = e.data;

  if (type !== 'PROCESS') return;

  try {
    const instance = await initFFmpeg();

    // Attach progress listener
    instance.on('progress', ({ progress }) => {
      const pct = Math.round(progress * 100);
      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: Math.min(pct, 100),
      } satisfies FFmpegWorkerResponse);
    });

    // Attach log listener
    instance.on('log', ({ message }) => {
      (self as unknown as Worker).postMessage({
        type: 'LOG',
        log: message,
      } satisfies FFmpegWorkerResponse);
    });

    // Write input file to virtual FS
    await instance.writeFile(payload.inputFileName, payload.inputData);

    // Execute FFmpeg command
    const ret = await instance.exec(payload.args);

    if (ret !== 0) {
      throw new Error(`FFmpeg exited with code ${ret}`);
    }

    // Read output file from virtual FS
    const outputData = await instance.readFile(payload.outputFileName);

    // Cleanup virtual FS
    await instance.deleteFile(payload.inputFileName);
    await instance.deleteFile(payload.outputFileName);

    (self as unknown as Worker).postMessage({
      type: 'DONE',
      outputData: outputData as Uint8Array,
      outputFileName: payload.outputFileName,
    } satisfies FFmpegWorkerResponse);
  } catch (error) {
    (self as unknown as Worker).postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown FFmpeg worker error',
    } satisfies FFmpegWorkerResponse);
  }
};
