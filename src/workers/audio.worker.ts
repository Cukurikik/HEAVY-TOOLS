/**
 * Omni-Tool Native Web Worker for Hybrid Audio Processing (Phase 26.2)
 * 
 * Architecture:
 * - Dual-Path: C++ Native WASM Kernel for high-performance DSP + FFmpeg for Codecs.
 * - WASM SIMD optimized kernels for Pitch Shifting, EQ, and Compression.
 * - FFmpeg handles decoding/encoding between formats (MP3/WAV/FLAC).
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { AudioCommandMatrix, AudioCommandPayload } from '@/modules/audio-studio/core/command-matrix';
import { NativeEngine } from '@/lib/native-engine';

// Singleton instances
let ffmpeg: FFmpeg | null = null;
const CORE_VERSION = '0.12.6';
const baseURL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

/**
 * Tools supported by the C++ Native Engine (faster + high precision)
 */
const NATIVE_AUDIO_TOOLS = ['equalizer', 'compressor', 'pitch-shifter', 'normalizer'];

/**
 * Initializes FFmpeg Core
 */
async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;
  ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => self.postMessage({ type: 'LOG', message: `[FFMPEG] ${message}` }));
  ffmpeg.on('progress', ({ progress }) => self.postMessage({ type: 'PROGRESS', progress: Math.min(Math.round(progress * 100), 100) }));
  
  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
  
  try {
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
    await ffmpeg.load({ coreURL, wasmURL, workerURL });
  } catch (err) {
    await ffmpeg.load({ coreURL, wasmURL });
  }
  return ffmpeg;
}

/**
 * Processes audio using the C++ WASM Native Engine
 */
async function processWithNativeKernel(instance: FFmpeg, payload: any) {
  const { toolSlug, file, options = {}, outputFormat = 'mp3' } = payload;
  const inputFilename = `raw_input_${Date.now()}`;
  const pcmFilename = `decoded.f32le`;
  const processedFilename = `processed.f32le`;
  const outputFilename = `native_output.${outputFormat}`;

  self.postMessage({ type: 'STATUS', status: 'native_kernel_init' });

  // 1. Decode to raw float PCM (single channel for DSP simplicity, or handle multi)
  // We use 44.1kHz s16le for wide compatibility and then cast in C++ if needed, 
  // but better to decode to f32le directly.
  const sampleRate = options.sampleRate || 44100;
  await instance.writeFile(inputFilename, await fetchFile(file));
  
  self.postMessage({ type: 'LOG', message: '[NativeAudio] Decoding to raw PCM...' });
  await instance.exec(['-i', inputFilename, '-f', 'f32le', '-ac', '1', '-ar', sampleRate.toString(), pcmFilename]);

  // 2. Load C++ Kernel
  const kernel = await NativeEngine.load('audio-dsp');
  const rawPcm = await instance.readFile(pcmFilename);
  const floatPcm = new Float32Array((rawPcm as any).buffer);

  self.postMessage({ type: 'STATUS', status: 'native_dsp_running' });
  self.postMessage({ type: 'LOG', message: `[NativeAudio] Running C++ DSP: ${toolSlug}` });

  let resultPcm: Float32Array;

  // 3. Execute specific C++ operation
  switch (toolSlug) {
    case 'equalizer':
      resultPcm = kernel.equalize(floatPcm, floatPcm.length, sampleRate, 
        options.lowGain || 0, options.midGain || 0, options.highGain || 0);
      break;
    case 'compressor':
      resultPcm = kernel.compress(floatPcm, floatPcm.length, sampleRate,
        options.threshold || -20, options.ratio || 4, options.attack || 10, options.release || 100);
      break;
    case 'pitch-shifter':
      resultPcm = kernel.pitchShift(floatPcm, floatPcm.length, sampleRate, options.semitones || 0);
      break;
    case 'normalizer':
      resultPcm = kernel.normalize(floatPcm, floatPcm.length, options.targetDb || -1);
      break;
    default:
      throw new Error(`Native tool ${toolSlug} not implemented in worker wrapper`);
  }

  // 4. Encode back to target format
  self.postMessage({ type: 'LOG', message: '[NativeAudio] Encoding result...' });
  await instance.writeFile(processedFilename, new Uint8Array(resultPcm.buffer));
  
  // FFmpeg command to wrap raw PCM back into container
  // -f f32le -ar [sr] -ac 1 -i [in] [out]
  await instance.exec([
    '-f', 'f32le', '-ar', sampleRate.toString(), '-ac', '1', 
    '-i', processedFilename, 
    outputFilename
  ]);

  const outputData = await instance.readFile(outputFilename);
  
  // Cleanup
  await instance.deleteFile(inputFilename);
  await instance.deleteFile(pcmFilename);
  await instance.deleteFile(processedFilename);
  await instance.deleteFile(outputFilename);

  return outputData;
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_AUDIO') {
    self.postMessage({ type: 'STATUS', status: 'initializing_engines' });
    
    try {
      const { toolSlug, file, outputFormat = 'mp3', options = {} } = payload;
      const instance = await loadFFmpeg();
      
      let finalData: Uint8Array;

      // ROUTING: Check if we should use Native C++ or FFmpeg fallback
      if (NATIVE_AUDIO_TOOLS.includes(toolSlug) && !payload.forceFfmpeg) {
        try {
          finalData = await processWithNativeKernel(instance, payload) as Uint8Array;
        } catch (nativeErr: any) {
          self.postMessage({ type: 'LOG', message: `[NativeAudio] Kernel failed: ${nativeErr.message}. Falling back to FFmpeg.` });
          return self.postMessage({ type: 'RETRY_FFMPEG', originalPayload: payload }); // Optional retry signal
        }
      } else {
        // Standard FFmpeg path
        const inputFilename = `in_${Date.now()}`;
        const outputFilename = `out_${Date.now()}.${outputFormat}`;
        await instance.writeFile(inputFilename, await fetchFile(file));
        
        const args = AudioCommandMatrix.resolve(toolSlug, {
          inputPath: inputFilename,
          outputPath: outputFilename,
          options,
          secondaryInputs: []
        });

        await instance.exec(args);
        finalData = await instance.readFile(outputFilename) as Uint8Array;
        await instance.deleteFile(inputFilename);
        await instance.deleteFile(outputFilename);
      }

      const finalBlob = new Blob([finalData as any], { type: `audio/${outputFormat}` });
      const objectUrl = URL.createObjectURL(finalBlob);

      self.postMessage({ 
        type: 'SUCCESS', 
        resultUrls: [objectUrl],
        metadata: { size: finalBlob.size, format: outputFormat } 
      });

    } catch (error: any) {
      self.postMessage({ type: 'ERROR', error: error.message || 'Audio Engine Failure' });
    }

  } else if (type === 'TERMINATE') {
    if (ffmpeg) ffmpeg.terminate();
    self.close();
  }
};

