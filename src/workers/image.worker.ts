/**
 * Omni-Tool Native Web Worker for Image Processing (Phase 23 + C++ Native)
 * 
 * Architecture:
 * - FAST PATH: C++ WASM kernel for pixel operations (resize/sharpen/denoise/blur)
 * - FALLBACK PATH: FFmpeg WASM for complex operations (format conversion, metadata)
 * - Uses SharedArrayBuffer threads where COOP/COEP allows.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ImageCommandMatrix } from '@/modules/image-engine/core/command-matrix';

let ffmpeg: FFmpeg | null = null;
const CORE_VERSION = '0.12.6';
const baseURL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

// ═══════════════════════════════════════════════════
// C++ Native Kernel (loaded on-demand)
// ═══════════════════════════════════════════════════
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let nativeKernel: any = null;
let nativeAvailable: boolean | null = null;

// Operations that the C++ kernel handles (5-10x faster than FFmpeg)
const NATIVE_OPS = new Set([
  'grayscale', 'sharpen', 'denoise', 'blur', 'gaussian-blur',
  'sepia', 'invert', 'brightness-contrast', 'resize',
]);

async function loadNativeKernel() {
  if (nativeAvailable === false) return null;
  if (nativeKernel) return nativeKernel;

  try {
    const checkResp = await fetch('/wasm/omni-image-kernel.wasm', { method: 'HEAD' });
    if (!checkResp.ok) {
      nativeAvailable = false;
      self.postMessage({ type: 'LOG', message: '[ImageWorker] C++ kernel not compiled. Using FFmpeg fallback.' });
      return null;
    }

    const jsResp = await fetch('/wasm/omni-image-kernel.js');
    if (!jsResp.ok) throw new Error('JS glue not found');
    const code = await jsResp.text();

    // eslint-disable-next-line no-new-func
    const factory = new Function(`return ${code}`)();
    nativeKernel = await factory({
      locateFile: (path: string) => path.endsWith('.wasm') ? '/wasm/omni-image-kernel.wasm' : path,
    });

    nativeAvailable = true;
    self.postMessage({ type: 'LOG', message: '[ImageWorker] ⚡ C++ Native Kernel ACTIVE — 5-10x faster!' });
    return nativeKernel;
  } catch (err) {
    nativeAvailable = false;
    self.postMessage({ type: 'LOG', message: `[ImageWorker] C++ kernel unavailable: ${(err as Error).message}` });
    return null;
  }
}

/**
 * Process an image using the C++ native kernel.
 * Reads pixel data from a File/Blob, runs the C++ function, returns a Blob URL.
 */
async function processWithNativeKernel(
  kernel: Record<string, (...args: unknown[]) => Uint8Array>,
  toolSlug: string,
  file: File,
  options: Record<string, unknown>,
  outputFormat: string
): Promise<string> {
  // Decode the image to raw RGBA pixels
  const imageBitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
  const pixels = new Uint8Array(imageData.data.buffer);
  const w = imageBitmap.width;
  const h = imageBitmap.height;

  self.postMessage({ type: 'PROGRESS', progress: 40 });

  // Route to the correct C++ function
  let resultPixels: Uint8Array;
  let outW = w, outH = h;

  const startTime = performance.now();

  switch (toolSlug) {
    case 'grayscale':
      resultPixels = kernel.grayscale(pixels, w, h);
      break;
    case 'sharpen':
      resultPixels = kernel.sharpen(pixels, w, h, (options.strength as number) ?? 1.0);
      break;
    case 'denoise':
      resultPixels = kernel.denoise(pixels, w, h, (options.strength as number) ?? 1.5);
      break;
    case 'blur':
    case 'gaussian-blur':
      resultPixels = kernel.gaussianBlur(pixels, w, h, (options.radius as number) ?? 5);
      break;
    case 'sepia':
      resultPixels = kernel.sepia(pixels, w, h);
      break;
    case 'invert':
      resultPixels = kernel.invert(pixels, w, h);
      break;
    case 'brightness-contrast':
      resultPixels = kernel.adjustBrightnessContrast(
        pixels, w, h,
        (options.brightness as number) ?? 0,
        (options.contrast as number) ?? 1.0
      );
      break;
    case 'resize':
      outW = (options.width as number) ?? Math.round(w / 2);
      outH = (options.height as number) ?? Math.round(h / 2);
      resultPixels = kernel.resize(pixels, w, h, outW, outH);
      break;
    default:
      throw new Error(`Native kernel doesn't support: ${toolSlug}`);
  }

  const elapsed = performance.now() - startTime;
  self.postMessage({ type: 'LOG', message: `[C++ Kernel] ⚡ ${toolSlug} completed in ${elapsed.toFixed(1)}ms` });
  self.postMessage({ type: 'PROGRESS', progress: 80 });

  // Encode result pixels back to an image format
  const outCanvas = new OffscreenCanvas(outW, outH);
  const outCtx = outCanvas.getContext('2d')!;
  const clampedData = new Uint8ClampedArray(resultPixels.length);
  clampedData.set(resultPixels);
  const outImageData = new ImageData(clampedData, outW, outH);
  outCtx.putImageData(outImageData, 0, 0);

  const blob = await outCanvas.convertToBlob({
    type: `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`,
    quality: (options.quality as number) ?? 0.92,
  });

  imageBitmap.close();
  return URL.createObjectURL(blob);
}

// ═══════════════════════════════════════════════════
// FFmpeg WASM Fallback Path
// ═══════════════════════════════════════════════════
async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;
  ffmpeg = new FFmpeg();

  ffmpeg.on('log', ({ message }) => {
    self.postMessage({ type: 'LOG', message });
  });

  ffmpeg.on('progress', ({ progress }) => {
    self.postMessage({ type: 'PROGRESS', progress: Math.min(Math.round(progress * 100), 100) });
  });

  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
  
  try {
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
    await ffmpeg.load({ coreURL, wasmURL, workerURL });
    self.postMessage({ type: 'LOG', message: '[WASM] Multi-Threaded FFmpeg Image Engine Active.' });
  } catch (err) {
    await ffmpeg.load({ coreURL, wasmURL });
    self.postMessage({ type: 'LOG', message: '[WASM] Fallback: Single-Thread FFmpeg Image Engine Active.' });
  }

  return ffmpeg;
}

// ═══════════════════════════════════════════════════
// Message Handler — Routes to Native C++ or FFmpeg WASM
// ═══════════════════════════════════════════════════
self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_IMAGE') {
    self.postMessage({ type: 'STATUS', status: 'initializing' });
    
    try {
      const { toolSlug, file, options = {}, outputFormat = 'webp' } = payload;

      // ═══ FAST PATH: Try C++ Native Kernel first ═══
      if (NATIVE_OPS.has(toolSlug)) {
        const kernel = await loadNativeKernel();
        if (kernel) {
          self.postMessage({ type: 'STATUS', status: 'processing_native_cpp' });
          const objectUrl = await processWithNativeKernel(kernel, toolSlug, file, options, outputFormat);

          self.postMessage({
            type: 'SUCCESS',
            resultUrls: [objectUrl],
            metadata: { format: outputFormat, engine: 'cpp-native' },
          });
          return;
        }
      }

      // ═══ FALLBACK PATH: FFmpeg WASM ═══
      self.postMessage({ type: 'STATUS', status: 'initializing_ffmpeg' });
      const instance = await loadFFmpeg();
      
      const inputFilename = `input_${file.name.replace(/\s+/g, '_')}`;
      const outputFilename = `output_${Date.now()}.${outputFormat}`;

      await instance.writeFile(inputFilename, await fetchFile(file));
      self.postMessage({ type: 'STATUS', status: 'processing' });

      const commandBuilder = ImageCommandMatrix[toolSlug];
      if (!commandBuilder) {
        throw new Error(`Image Tool [${toolSlug}] not implemented natively yet.`);
      }

      const args = commandBuilder(inputFilename, outputFilename, options);
      self.postMessage({ type: 'LOG', message: `Executing: ffmpeg ${args.join(' ')}` });

      const execCode = await instance.exec(args);
      if (execCode !== 0) {
        throw new Error(`FFmpeg exited with error code ${execCode}`);
      }

      self.postMessage({ type: 'STATUS', status: 'finalizing_chunks' });

      const data = await instance.readFile(outputFilename);
      
      await instance.deleteFile(inputFilename);
      await instance.deleteFile(outputFilename);

      const finalBlob = new Blob([data as unknown as BlobPart], { type: `image/${outputFormat}` });
      const objectUrl = URL.createObjectURL(finalBlob);

      self.postMessage({ 
        type: 'SUCCESS', 
        resultUrls: [objectUrl],
        metadata: { size: finalBlob.size, format: outputFormat, engine: 'ffmpeg-wasm' } 
      });

    } catch (error: unknown) {
      self.postMessage({ type: 'ERROR', error: (error as Error).message || 'Fatal Image Engine Failure' });
    }

  } else if (type === 'TERMINATE') {
    self.postMessage({ type: 'LOG', message: 'Termination Order Received. Core shutdown.' });
    if (ffmpeg) ffmpeg.terminate();
    self.close();
  }
};
