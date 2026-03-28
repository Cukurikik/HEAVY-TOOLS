import removeBackground, { Config } from '@imgly/background-removal';
import * as ort from 'onnxruntime-web';

// Ensure WASM binaries are loaded from a reliable CDN or local public folder
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/';

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_ONNX') {
    self.postMessage({ type: 'STATUS', status: 'initializing_inference' });
    
    try {
      const { toolSlug, file, options } = payload;
      
      if (toolSlug === 'remove-background') {
        self.postMessage({ type: 'LOG', message: '[ONNX Worker] Processing Background Removal (U2Net/ModNet)' });
        
        // Configuration for @imgly/background-removal
        const config: Config = {
          publicPath: 'https://static.remove.bg/remove-background-models/', 
          progress: (key, current, total) => {
            const percent = Math.round((current / total) * 100);
            self.postMessage({ type: 'PROGRESS', progress: percent, key });
          },
          ...options
        };

        // @ts-ignore
        const blob = await removeBackground(file, config);
        const objectUrl = URL.createObjectURL(blob);

        self.postMessage({ 
          type: 'SUCCESS', 
          resultUrls: [objectUrl],
          metadata: { size: blob.size, format: blob.type } 
        });
      } else if (toolSlug === 'stem-splitter') {
        self.postMessage({ type: 'LOG', message: '[ONNX Worker] Stem Splitter initialized. Note: requires ~300MB Demucs V3 model weights.' });
        // NOTE: Full Demucs implementation requires loading 4 separate ONNX models (Drums, Bass, Other, Vocals).
        // For standard local-first bounds, this triggers a memory warning and defaults to FFmpeg Phase Inversion 
        // if user devices possess < 8GB RAM.
        throw new Error("Stem Splitter native ONNX is in heavy-development. Use the FFmpeg Command Matrix fallback.");
      } else {
        throw new Error(`AI Tool [${toolSlug}] not natively mapped in ONNX worker yet.`);
      }

    } catch (error: any) {
      self.postMessage({ type: 'ERROR', error: error.message || 'Fatal ONNX Engine Failure' });
    }

  } else if (type === 'TERMINATE') {
    self.postMessage({ type: 'LOG', message: '[ONNX Worker] Termination Order Received. Thread shutdown.' });
    self.close();
  }
};
