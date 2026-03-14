// ============================================================
// FEATURE 01 — IMAGE CONVERTER — Web Worker
// ============================================================
/// <reference lib="webworker" />

addEventListener('message', async (event: MessageEvent) => {
  const { file, outputFormat, quality } = event.data;
  try {
    postMessage({ type: 'progress', value: 10 });

    const buffer = await (file as File).arrayBuffer();
    const bitmap = await createImageBitmap(new Blob([buffer]));

    postMessage({ type: 'progress', value: 30 });

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot create canvas context');

    ctx.drawImage(bitmap, 0, 0);
    postMessage({ type: 'progress', value: 60 });

    const mimeMap: Record<string, string> = {
      jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
      avif: 'image/avif', bmp: 'image/bmp', tiff: 'image/tiff', gif: 'image/gif',
    };
    const mime = mimeMap[outputFormat] || 'image/png';
    const blob = await canvas.convertToBlob({ type: mime, quality: quality / 100 });

    postMessage({ type: 'progress', value: 90 });
    postMessage({ type: 'complete', data: blob });
  } catch (err) {
    postMessage({ type: 'error', errorCode: 'CONVERSION_FAILED', message: String(err) });
  }
});
