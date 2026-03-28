/**
 * Omni-Tool Native Web Worker for Authentic FFmpeg WASM Video Processing (Phase 22)
 * 
 * Architecture:
 * - Uses SharedArrayBuffer threads where COOP/COEP allows.
 * - Injects the 30-Tier Command Matrix generated in Phase 22.
 * - Synchronously monitors output logs to parse highly-accurate percentage tracking.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VideoCommandMatrix } from '@/modules/video-engine/core/command-matrix';

// Singleton instance inside the worker
let ffmpeg: FFmpeg | null = null;
const CORE_VERSION = '0.12.6';
const baseURL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

/**
 * Initializes FFmpeg Core strictly once per WebWorker lifecycle
 */
async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  // Route FFmpeg terminal logs directly to the main thread for the Logger Dashboard
  ffmpeg.on('log', ({ message }) => {
    self.postMessage({ type: 'LOG', message });
  });

  // Tap into the native progress API for exact visual tracking
  ffmpeg.on('progress', ({ progress }) => {
    self.postMessage({ type: 'PROGRESS', progress: Math.min(Math.round(progress * 100), 100) });
  });

  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
  
  // Conditionally load multi-threading core if environment permits
  // Fallback to single-thread if strict COOP/COEP isolates are mismatched
  try {
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
    await ffmpeg.load({ coreURL, wasmURL, workerURL });
    self.postMessage({ type: 'LOG', message: '[WASM] Multi-Threaded FFmpeg Active.' });
  } catch (err) {
    await ffmpeg.load({ coreURL, wasmURL });
    self.postMessage({ type: 'LOG', message: '[WASM] Fallback: Single-Thread FFmpeg Active.' });
  }

  return ffmpeg;
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_VIDEO') {
    self.postMessage({ type: 'STATUS', status: 'initializing_ffmpeg' });
    
    try {
      const { toolSlug, file, options, outputFormat = 'mp4' } = payload;
      const omniConfig = options._omniEngineConfig || {};
      const maxThreads = omniConfig.workerPoolLimit ?? 50;
      const hwAccel = omniConfig.hardwareAcceleration ?? 'Auto';

      self.postMessage({ type: 'LOG', message: `[ENGINE] Configured with Limit: ${maxThreads} Threads, HW Accel: ${hwAccel}` });
      
      const instance = await loadFFmpeg();
      
      const inputFilename = `input_${file.name}`;
      const outputFilename = `output_${Date.now()}.${outputFormat}`;

      // 1. Write the raw video into FFmpeg's isolated Origin Virtual File System (MEMFS)
      await instance.writeFile(inputFilename, await fetchFile(file));
      self.postMessage({ type: 'STATUS', status: 'transcoding' });

      // 2. Look up the exact complex terminal command array from Phase 22 Architecture
      const commandBuilder = VideoCommandMatrix[toolSlug];
      if (!commandBuilder) {
        throw new Error(`Tool [${toolSlug}] not implemented in Phase 22 Engine.`);
      }

      const baseArgs = commandBuilder(inputFilename, outputFilename, options);
      
      // Inject thread limits dynamically per user settings
      let threadsToUse = maxThreads;
      // OS core heuristic: clamp if auto (usually auto passes 50 or 0 depending on the slider, let's just clamp to 32 max for wasm stability)
      threadsToUse = Math.min(Math.max(threadsToUse, 1), 32); 

      const args = ['-threads', String(threadsToUse), ...baseArgs];
      
      self.postMessage({ type: 'LOG', message: `Executing: ffmpeg ${args.join(' ')}` });

      // 3. Blast the command into the WASM Core
      await instance.exec(args);

      self.postMessage({ type: 'STATUS', status: 'finalizing_chunks' });

      // 4. Retrieve the processed raw buffer 
      const data = await instance.readFile(outputFilename);
      
      // Cleanup Virtual Memory instantly! Memory Leaks are fatal.
      await instance.deleteFile(inputFilename);
      await instance.deleteFile(outputFilename);

      // 5. Send back via Blob Object URL
      const finalBlob = new Blob([new Uint8Array(data as unknown as ArrayBufferLike) as any], { type: `video/${outputFormat}` });
      const objectUrl = URL.createObjectURL(finalBlob);

      self.postMessage({ 
        type: 'SUCCESS', 
        resultUrls: [objectUrl],
        metadata: { size: finalBlob.size, format: outputFormat } 
      });

    } catch (error: any) {
      self.postMessage({ type: 'ERROR', error: error.message || 'Fatal Engine Failure' });
    }

  } else if (type === 'TERMINATE') {
    self.postMessage({ type: 'LOG', message: 'Termination Order Received. Core shutdown.' });
    if (ffmpeg) ffmpeg.terminate();
    self.close(); // Clean suicide
  }
};
