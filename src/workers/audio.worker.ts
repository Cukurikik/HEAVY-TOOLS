/**
 * Omni-Tool Native Web Worker for Authentic FFmpeg WASM Audio Processing (Phase 26)
 * 
 * Architecture:
 * - Uses SharedArrayBuffer threads where COOP/COEP allows.
 * - Injects the 30-Tier Audio Command Matrix generated in Phase 26.
 * - Synchronously monitors output logs to parse highly-accurate percentage tracking.
 * - Designed specifically for Digital Signal Processing (DSP) like Reverb, Compression, and Mastering.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { AudioCommandMatrix, AudioToolCommand, AudioCommandPayload } from '@/modules/audio-studio/core/command-matrix';

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
  try {
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
    await ffmpeg.load({ coreURL, wasmURL, workerURL });
    self.postMessage({ type: 'LOG', message: '[WASM AUDIO] Multi-Threaded FFmpeg Active.' });
  } catch (err) {
    await ffmpeg.load({ coreURL, wasmURL });
    self.postMessage({ type: 'LOG', message: '[WASM AUDIO] Fallback: Single-Thread FFmpeg Active.' });
  }

  return ffmpeg;
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_AUDIO') {
    self.postMessage({ type: 'STATUS', status: 'initializing_ffmpeg' });
    
    try {
      const { toolSlug, file, secondaryFiles = [], options = {}, outputFormat = 'mp3' } = payload;
      
      const instance = await loadFFmpeg();
      
      const inputFilename = `input_${Date.now()}_${file.name}`;
      const outputFilename = `output_${Date.now()}.${outputFormat}`;

      // 1. Write the primary raw audio into FFmpeg's isolated Origin Virtual File System (MEMFS)
      await instance.writeFile(inputFilename, await fetchFile(file));
      
      const secondaryInputs: string[] = [];
      
      // 2. Handle Secondary Inputs (e.g. for Audio Merger)
      if (toolSlug === 'merger' && secondaryFiles.length > 0) {
        let concatContent = `file '${inputFilename}'\n`;
        
        for (let i = 0; i < secondaryFiles.length; i++) {
          const secFile = secondaryFiles[i];
          const secName = `sec_${i}_${secFile.name}`;
          await instance.writeFile(secName, await fetchFile(secFile));
          concatContent += `file '${secName}'\n`;
          secondaryInputs.push(secName);
        }
        
        // Write the required concat.txt file for safe concat demuxer
        const listName = `concat_list_${Date.now()}.txt`;
        await instance.writeFile(listName, concatContent);
        secondaryInputs.push(listName); // Specifically using this as the primary resolution bypass if needed
      }

      self.postMessage({ type: 'STATUS', status: 'processing_dsp' });

      // 3. Resolve the massive 30-Tier DSP Command Matrix 
      const matrixPayload: AudioCommandPayload = {
        inputPath: toolSlug === 'merger' ? secondaryInputs.find(s => s.endsWith('.txt')) || inputFilename : inputFilename,
        outputPath: outputFilename,
        options,
        secondaryInputs
      };

      const args = AudioCommandMatrix.resolve(toolSlug as AudioToolCommand, matrixPayload);
      
      self.postMessage({ type: 'LOG', message: `Executing: ffmpeg ${args.join(' ')}` });

      // 4. Blast the command into the WASM Core
      await instance.exec(args);

      self.postMessage({ type: 'STATUS', status: 'finalizing_chunks' });

      // 5. Retrieve the processed raw buffer 
      const data = await instance.readFile(outputFilename);
      
      // 6. Memory Cleanup (Prevent Leaks)
      await instance.deleteFile(inputFilename);
      await instance.deleteFile(outputFilename);
      for (const sName of secondaryInputs) {
        try { await instance.deleteFile(sName); } catch (e) {}
      }

      // 7. Send back via Blob Object URL securely bypassing serialization bounds
      const finalBlob = new Blob([new Uint8Array(data as unknown as ArrayBufferLike) as any], { type: `audio/${outputFormat}` });
      const objectUrl = URL.createObjectURL(finalBlob);

      self.postMessage({ 
        type: 'SUCCESS', 
        resultUrls: [objectUrl],
        metadata: { size: finalBlob.size, format: outputFormat } 
      });

    } catch (error: any) {
      self.postMessage({ type: 'ERROR', error: error.message || 'Fatal Audio Engine Failure' });
    }

  } else if (type === 'TERMINATE') {
    self.postMessage({ type: 'LOG', message: 'Termination Order Received. Core shutdown.' });
    if (ffmpeg) ffmpeg.terminate();
    self.close(); // Clean suicide
  }
};
