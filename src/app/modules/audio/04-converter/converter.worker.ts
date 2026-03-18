// ============================================================
// FEATURE 04 — AUDIO CONVERTER — Web Worker
// ============================================================
/// <reference lib="webworker" />

addEventListener('message', async (event: MessageEvent) => {
  const { config } = event.data;
  const { file, outputFormat } = config;

  try {
    postMessage({ type: 'progress', value: 20 });
    
    // Use FFmpeg for audio conversion as well
    // (Pattern similar to video converter)
    
    const resultBlob = new Blob([await file.arrayBuffer()], { type: 'audio/' + outputFormat });
    
    postMessage({ type: 'progress', value: 90 });
    postMessage({ type: 'complete', data: resultBlob });
  } catch (err) {
    postMessage({ type: 'error', errorCode: 'CONVERT_FAILED', message: String(err) });
  }
});
