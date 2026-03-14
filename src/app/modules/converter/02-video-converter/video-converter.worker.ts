/// <reference lib="webworker" />
addEventListener('message', async (event: MessageEvent) => {
  const { file, outputFormat, crf, encodingSpeed } = event.data;
  try {
    postMessage({ type: 'progress', value: 5 });
    const buffer = await (file as File).arrayBuffer();
    postMessage({ type: 'progress', value: 20 });
    // FFmpeg WASM would be loaded here in production
    // For now, pass-through the file as a demonstration
    postMessage({ type: 'progress', value: 80 });
    const blob = new Blob([buffer], { type: `video/${outputFormat}` });
    postMessage({ type: 'complete', data: blob });
  } catch (err) {
    postMessage({ type: 'error', errorCode: 'CONVERSION_FAILED', message: String(err) });
  }
});
