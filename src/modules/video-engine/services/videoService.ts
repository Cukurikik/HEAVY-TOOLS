import { FFmpeg } from '@ffmpeg/ffmpeg';

import * as engines from '../engines';
import JSZip from 'jszip';
import type { VideoOperation } from '../types';

let ffmpeg: FFmpeg | null = null;
let currentOnProgress: ((p: number) => void) | null = null;
let currentOnLog: ((l: string) => void) | null = null;

export async function initFFmpeg(onProgress: (p: number) => void, onLog: (l: string) => void) {
  currentOnProgress = onProgress;
  currentOnLog = onLog;

  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }: { progress: number }) => {
    if (currentOnProgress) currentOnProgress(Math.min(Math.round(progress * 100), 99));
  });
  ffmpeg.on('log', ({ message }: { message: string }) => {
    if (currentOnLog) currentOnLog(message);
  });

  // Use the local UMD worker so Webpack doesn't intercept it.
  const baseURL = window.location.origin + '/ffmpeg';
  await ffmpeg.load({
    classWorkerURL: `${baseURL}/814.ffmpeg.js`,
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    workerURL: `${baseURL}/ffmpeg-core.worker.js`,
  });

  return ffmpeg;
}

export async function executeVideoTask(
  payload: { operation: VideoOperation; file: File | null; files: File[]; options: Record<string, unknown> },
  onProgress: (pct: number) => void,
  onLog: (msg: string) => void
): Promise<{ outputData: Uint8Array; outputMimeType: string }> {
  const instance = await initFFmpeg(onProgress, onLog);

  if (payload.operation === 'batch-processor') {
    const zip = new JSZip();
    for (let i = 0; i < payload.files.length; i++) {
      const f = payload.files[i];
      const ext = f.name.substring(f.name.lastIndexOf('.'));
      const inputName = `batch_in_${i}${ext}`;
      const outputName = `batch_out_${i}.mp4`;

      const arrayBuffer = await f.arrayBuffer();
      await instance.writeFile(inputName, new Uint8Array(arrayBuffer));
      // @ts-ignore
      const args = await engines.buildBatchProcessorArgs(inputName, outputName, payload.options, instance, payload.files);

      onProgress(Math.round((i / payload.files.length) * 100));

      const ret = await instance.exec(args);
      if (ret !== 0) throw new Error("Batch failed on file " + f.name);

      const data = await instance.readFile(outputName);
      zip.file(`processed_${f.name}`, data);
    }

    const zipData = await zip.generateAsync({ type: 'blob' });
    const arrayBuffer = await zipData.arrayBuffer();

    return {
      outputData: new Uint8Array(arrayBuffer),
      outputMimeType: 'application/zip',
    };
  }

  if (!payload.file) throw new Error("No file provided");
  const inputExt = payload.file.name.substring(payload.file.name.lastIndexOf('.'));
  const inputName = 'input' + inputExt;

  const engineKeyParts = payload.operation.split('-');
  const engineKey = engineKeyParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  
  const buildArgsName = `build${engineKey}Args` as keyof typeof engines;
  const getOutputNameFn = `get${engineKey}OutputName` as keyof typeof engines;
  const getMimeTypeFn = `get${engineKey}MimeType` as keyof typeof engines;

  const buildFn = engines[buildArgsName] as any;
  const getOutput = engines[getOutputNameFn] as any;
  const getMime = engines[getMimeTypeFn] as any;

  if (!buildFn) throw new Error("Engine not found for operation: " + payload.operation);

  const outputName = getOutput(payload.options);
  const outputMimeType = getMime(payload.options);

  const arrayBuffer = await payload.file.arrayBuffer();
  await instance.writeFile(inputName, new Uint8Array(arrayBuffer));
  const args = await buildFn(inputName, outputName, payload.options, instance, payload.files);

  if (args.length > 0) {
    const ret = await instance.exec(args);
    if (ret !== 0) {
      throw new Error(`FFmpeg exited with code ${ret}`);
    }
  }

  if (payload.operation === 'video-splitter') {
    const zip = new JSZip();
    const dirFiles = await instance.listDir('/');
    for (const f of dirFiles) {
      if (f.name.startsWith('segment_') && f.name.endsWith('.mp4')) {
        const data = await instance.readFile(f.name);
        zip.file(f.name, data as Uint8Array);
      }
    }
    const zipData = await zip.generateAsync({ type: 'blob' });
    const arrayBuffer = await zipData.arrayBuffer();

    return {
      outputData: new Uint8Array(arrayBuffer),
      outputMimeType: 'application/zip',
    };
  }

  const outputData = await instance.readFile(outputName);

  return {
    outputData: outputData as Uint8Array,
    outputMimeType,
  };
}
