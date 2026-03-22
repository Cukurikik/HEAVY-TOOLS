/**
 * FFmpeg WASM Web Worker
 * Handles all 30 client-side FFmpeg processing tasks off the main thread.
 * Communicates via postMessage for progress, logs, and completion.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

import * as engines from '../engines';
import JSZip from 'jszip';

let ffmpeg = null;

async function initFFmpeg() {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = self.location.origin + '/ffmpeg';
  try {
    const [classWorkerURL, coreURL, wasmURL, workerURL] = await Promise.all([
      toBlobURL(`${baseURL}/814.ffmpeg.js`, 'text/javascript'),
      toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    ]);

    await ffmpeg.load({
      classWorkerURL,
      coreURL,
      wasmURL,
      workerURL,
    });
  } catch (error) {
    console.error("FFmpeg worker load error:", error);
    const unpkgBaseURL = 'https://unpkg.com/@ffmpeg/core@0.12.9/dist/umd';
    const unpkgClassWorkerURL = 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js';

    const [classWorkerURL, coreURL, wasmURL, workerURL] = await Promise.all([
      toBlobURL(unpkgClassWorkerURL, 'text/javascript'),
      toBlobURL(`${unpkgBaseURL}/ffmpeg-core.js`, 'text/javascript'),
      toBlobURL(`${unpkgBaseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      toBlobURL(`${unpkgBaseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    ]);

    await ffmpeg.load({
      classWorkerURL,
      coreURL,
      wasmURL,
      workerURL,
    });
  }

  return ffmpeg;
}

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type !== 'PROCESS') return;

  try {
    const instance = await initFFmpeg();

    // Attach progress listener
    instance.on('progress', ({ progress }) => {
      const pct = Math.round(progress * 100);
      postMessage({
        type: 'PROGRESS',
        progress: Math.min(pct, 99),
      });
    });

    // Attach log listener
    const logCallback = ({ message }) => {
      postMessage({
        type: 'LOG',
        log: message,
      });
    };
    instance.on('log', logCallback);

    if (payload.operation === 'batch-processor') {
      const zip = new JSZip();
      for (let i = 0; i < payload.files.length; i++) {
        const f = payload.files[i];
        const ext = f.name.substring(f.name.lastIndexOf('.'));
        const inputName = `batch_in_${i}${ext}`;
        const outputName = `batch_out_${i}.mp4`;

        const arrayBuffer = await f.arrayBuffer();
        await instance.writeFile(inputName, new Uint8Array(arrayBuffer));
        const args = await engines.buildBatchProcessorArgs(inputName, outputName, payload.options, instance, payload.files);

        postMessage({ type: 'PROGRESS', progress: Math.round((i / payload.files.length) * 100) });

        const ret = await instance.exec(args);
        if (ret !== 0) {
          throw new Error(`Batch processing failed on file: ${f.name}. Please ensure the file is valid and try again.`);
        }

        const data = await instance.readFile(outputName);
        zip.file(`processed_${f.name}`, data);
      }

      instance.off('log', logCallback);
      const zipData = await zip.generateAsync({ type: 'blob' });
      const arrayBuffer = await zipData.arrayBuffer();

      postMessage({
        type: 'DONE',
        outputData: new Uint8Array(arrayBuffer),
        outputMimeType: 'application/zip',
      });
      return;
    }

    if (!payload.file) throw new Error("No file provided");
    const inputExt = payload.file.name.substring(payload.file.name.lastIndexOf('.'));
    const inputName = 'input' + inputExt;

    const engineKeyParts = payload.operation.split('-');
    const engineKey = engineKeyParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    
    const buildArgsName = `build${engineKey}Args`;
    const getOutputNameFn = `get${engineKey}OutputName`;
    const getMimeTypeFn = `get${engineKey}MimeType`;

    const buildFn = engines[buildArgsName];
    const getOutput = engines[getOutputNameFn];
    const getMime = engines[getMimeTypeFn];

    if (!buildFn) throw new Error("Engine not found for operation: " + payload.operation);

    const outputName = getOutput(payload.options);
    const outputMimeType = getMime(payload.options);

    const arrayBuffer = await payload.file.arrayBuffer();
    await instance.writeFile(inputName, new Uint8Array(arrayBuffer));
    const args = await buildFn(inputName, outputName, payload.options, instance, payload.files);

    if (args.length > 0) {
      const ret = await instance.exec(args);
      instance.off('log', logCallback);
      if (ret !== 0) {
        throw new Error(`FFmpeg process failed with code ${ret}. Please check your configuration and try again.`);
      }
    } else {
      instance.off('log', logCallback);
    }

    if (payload.operation === 'video-splitter') {
      const zip = new JSZip();
      const dirFiles = await instance.listDir('/');
      for (const f of dirFiles) {
        if (f.name.startsWith('segment_') && f.name.endsWith('.mp4')) {
          const data = await instance.readFile(f.name);
          zip.file(f.name, data);
        }
      }
      const zipData = await zip.generateAsync({ type: 'blob' });
      const arrayBuffer = await zipData.arrayBuffer();

      postMessage({
        type: 'DONE',
        outputData: new Uint8Array(arrayBuffer),
        outputMimeType: 'application/zip',
      });
      return;
    }

    const outputData = await instance.readFile(outputName);

    postMessage({
      type: 'DONE',
      outputData: outputData,
      outputMimeType,
    });
  } catch (error) {
    console.error("FFmpeg Worker Error Caught:", error);
    postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error) || 'Unknown FFmpeg worker error',
    });
  }
};
