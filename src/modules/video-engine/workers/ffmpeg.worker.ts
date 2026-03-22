import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import * as engines from '../engines';

let ffmpeg: FFmpeg | null = null;

// The user wanted Web Workers to avoid main-thread freeze. 
self.onmessage = async (e) => {
  const { type, payload } = e.data;
  if (type === 'PROCESS') {
    try {
      if (!ffmpeg) {
        ffmpeg = new FFmpeg();
        ffmpeg.on('progress', ({ progress }) => {
          self.postMessage({ type: 'PROGRESS', progress: Math.min(Math.round(progress * 100), 99) });
        });
        ffmpeg.on('log', ({ message }) => {
          self.postMessage({ type: 'LOG', message });
        });

        const baseURL = self.location.origin + '/ffmpeg';
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
          classWorkerURL: await toBlobURL(`${baseURL}/814.ffmpeg.js`, 'text/javascript'),
        });
      }

      if (!payload.file && payload.files?.length === 0) {
        throw new Error("No files provided");
      }

      // We ensure the mount point exists for Emscripten FS
      try {
        await ffmpeg.createDir('/opt');
      } catch (e) { /* Ignore if exists */ }

      // We mount WORKERFS to avoid out-of-memory errors on large files
      // @ts-ignore - WORKERFS uses OPFS implicitly in browsers, bypassing MEMFS crashes
      await ffmpeg.mount('WORKERFS', { files: payload.file ? [payload.file] : payload.files }, '/opt');

      const fileToProcess = payload.file || payload.files[0];
      const inputName = '/opt/' + fileToProcess.name;
      
      const engineKeyParts = payload.operation.split('-');
      const engineKey = engineKeyParts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
      
      const buildFn = (engines as any)[`build${engineKey}Args`];
      const getOutput = (engines as any)[`get${engineKey}OutputName`];
      const getMime = (engines as any)[`get${engineKey}MimeType`];
      
      if (!buildFn) throw new Error(`Engine not found for operation: ${payload.operation}`);

      const outputName = getOutput(payload.options);
      
      // We pass the absolute path (/opt/filename) to the engine
      const args = await buildFn(inputName, outputName, payload.options, ffmpeg, payload.files);
      
      const ret = await ffmpeg.exec(args);
      if (ret !== 0) {
        throw new Error(`FFmpeg process failed with code ${ret}. File may be corrupted or settings are invalid.`);
      }

      const outputData = await ffmpeg.readFile(outputName);
      
      await ffmpeg.unmount('/opt');

      self.postMessage({ 
        type: 'DONE', 
        outputData, 
        outputMimeType: getMime(payload.options) 
      });

    } catch (error: any) {
      let errorMessage = "Engine failure during execution";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.message) {
        errorMessage = error.message;
      } else {
        try { errorMessage = JSON.stringify(error); } catch (e) {}
      }

      self.postMessage({ 
        type: 'ERROR', 
        error: errorMessage
      });
    }
  }
};
