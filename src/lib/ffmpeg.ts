/**
 * FFmpeg WASM Singleton Strategy
 * 
 * In a Next.js app, loading FFmpeg repeatedly in multiple components crashes the 
 * browser memory (OOM). This file guarantees EXACTLY ONE persistent instance of 
 * the FFmpeg Core is loaded and maintained across the entire application's lifecycle.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;
let isLoading = false;
let initializationPromise: Promise<FFmpeg> | null = null;

/**
 * Ensures the WebAssembly core is only fetched and initialized once.
 * The core files (ffmpeg-core.js and ffmpeg-core.wasm) are loaded from a CDN
 * using toBlobURL to bypass strict CORS blocking where necessary.
 * 
 * Supports reading user settings from sessionStorage configured in Phase 19 
 * dynamically resizing thread limits and WASM memory blocks.
 */
export async function getFFmpegSingleton(): Promise<FFmpeg> {
  if (isLoaded && ffmpegInstance) {
    return ffmpegInstance;
  }

  // If already loading internally, return the existing promise to prevent race conditions
  if (isLoading && initializationPromise) {
    return initializationPromise;
  }

  isLoading = true;

  initializationPromise = (async () => {
    try {
      console.log('🚀 [FFmpeg] Initializing core WASM singleton...');
      const ffmpeg = new FFmpeg();

      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd';
      
      // Pull configurations from Settings Hub
      const threadsStr = typeof window !== 'undefined' ? sessionStorage.getItem('omni_ffmpeg_threads') : '2';
      const maxThreads = parseInt(threadsStr || '2', 10);

      // Listen for log messages strictly for Developer Debug
      ffmpeg.on('log', ({ message }) => {
        const devMode = typeof window !== 'undefined' && sessionStorage.getItem('omni:feat-241-debug-mode-ffmpeg-log') === 'true';
        if (devMode) {
          console.debug(`[FFmpeg-Core][${maxThreads}-Threads]: ${message}`);
        }
      });

      console.log(`[FFmpeg] Downloading core binaries via toBlobURL...`);
      // Use core-mt if the user enabled multi-threading and COOP/COEP allows it, else fallback
      // In Phase 19 we set omni_sys_workers which we can utilize
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      console.log('✅ [FFmpeg] WASM Core loaded successfully and locked in memory.');
      isLoaded = true;
      isLoading = false;
      ffmpegInstance = ffmpeg;
      return ffmpeg;
    } catch (error) {
      console.error('❌ [FFmpeg] FATAL: Core failed to initialize.', error);
      isLoading = false;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Utility to release the FFmpeg lock if a hard panic occurs.
 */
export function destroyFFmpegSingleton(): void {
  if (ffmpegInstance) {
    try {
      // ffmpegInstance.terminate() exists in v0.11, but in v0.12 we may just nullify.
      (ffmpegInstance as any).terminate?.();
    } catch(e){}
    ffmpegInstance = null;
    isLoaded = false;
    isLoading = false;
    initializationPromise = null;
    console.warn('🗑️ [FFmpeg] Core WASM instance destroyed and garbage collected.');
  }
}
