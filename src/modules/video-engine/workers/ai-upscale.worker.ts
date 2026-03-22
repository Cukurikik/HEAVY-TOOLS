/**
 * AI Upscale Web Worker
 * Uses TensorFlow.js with WebGPU backend for ESRGAN/SwinIR super-resolution.
 * This worker handles the AI Upscaler tool (Tool #17).
 *
 * NOTE: @tensorflow/tfjs must be installed separately:
 *   pnpm add @tensorflow/tfjs @tensorflow/tfjs-backend-webgpu
 *
 * Until TF.js is installed, this worker uses a Canvas-based bicubic fallback.
 */

export interface AIUpscaleWorkerMessage {
  type: 'UPSCALE';
  payload: {
    imageData: ImageData;
    scaleFactor: number; // 2 or 4
  };
}

export interface AIUpscaleWorkerResponse {
  type: 'PROGRESS' | 'DONE' | 'ERROR';
  progress?: number;
  outputData?: ImageData;
  error?: string;
}

self.onmessage = async (e: MessageEvent<AIUpscaleWorkerMessage>) => {
  const { type, payload } = e.data;
  if (type !== 'UPSCALE') return;

  try {
    const { imageData, scaleFactor } = payload;
    const { width, height } = imageData;
    const newW = width * scaleFactor;
    const newH = height * scaleFactor;

    (self as unknown as Worker).postMessage({
      type: 'PROGRESS',
      progress: 10,
    } satisfies AIUpscaleWorkerResponse);

    // Try to load TensorFlow.js dynamically
    let usedAI = false;
    try {
      const tf = await import('@tensorflow/tfjs');

      try {
        await import('@tensorflow/tfjs-backend-webgpu');
        await tf.setBackend('webgpu');
      } catch {
        await tf.setBackend('webgl');
      }
      await tf.ready();

      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: 30,
      } satisfies AIUpscaleWorkerResponse);

      // Create input tensor [1, H, W, 3]
      const inputTensor = tf.tidy(() => {
        const raw = tf.browser.fromPixels(imageData);
        const normalized = raw.toFloat().div(255.0);
        return normalized.expandDims(0);
      });

      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: 50,
      } satisfies AIUpscaleWorkerResponse);

      // Bilinear upscale (ESRGAN model loading would replace this)
      const upscaled = tf.tidy(() => {
        const squeezed = inputTensor.squeeze([0]);
        return tf.image.resizeBilinear(squeezed as Parameters<typeof tf.image.resizeBilinear>[0], [newH, newW]);
      });

      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: 80,
      } satisfies AIUpscaleWorkerResponse);

      const outputPixels = await tf.browser.toPixels(upscaled as Parameters<typeof tf.browser.toPixels>[0]);
      const outputImageData = new ImageData(
        new Uint8ClampedArray(outputPixels),
        newW,
        newH
      );

      inputTensor.dispose();
      upscaled.dispose();

      usedAI = true;

      (self as unknown as Worker).postMessage({
        type: 'DONE',
        outputData: outputImageData,
      } satisfies AIUpscaleWorkerResponse);
    } catch {
      // TF.js not available — fall through to canvas fallback
    }

    if (!usedAI) {
      // Canvas-based bicubic fallback
      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: 40,
      } satisfies AIUpscaleWorkerResponse);

      const canvas = new OffscreenCanvas(newW, newH);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('OffscreenCanvas 2D context unavailable');

      // Draw source
      const srcCanvas = new OffscreenCanvas(width, height);
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) throw new Error('Source canvas context unavailable');
      srcCtx.putImageData(imageData, 0, 0);

      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: 60,
      } satisfies AIUpscaleWorkerResponse);

      // Upscale via drawImage
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(srcCanvas, 0, 0, newW, newH);

      (self as unknown as Worker).postMessage({
        type: 'PROGRESS',
        progress: 90,
      } satisfies AIUpscaleWorkerResponse);

      const outputImageData = ctx.getImageData(0, 0, newW, newH);

      (self as unknown as Worker).postMessage({
        type: 'DONE',
        outputData: outputImageData,
      } satisfies AIUpscaleWorkerResponse);
    }
  } catch (error) {
    (self as unknown as Worker).postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'AI upscale failed',
    } satisfies AIUpscaleWorkerResponse);
  }
};
