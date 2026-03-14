// ============================================================
// FEATURE 24 — SPREADSHEET CONVERTER — Web Worker
// ============================================================
/// <reference lib="webworker" />

addEventListener('message', async (event: MessageEvent) => {
  const config = event.data;
  try {
    postMessage({ type: 'progress', value: 10 });

    // Extract input data
    const file = config.file as File | undefined;
    const inputText = config.inputText as string | undefined;
    const outputFormat = config.outputFormat as string;

    postMessage({ type: 'progress', value: 30 });

    let resultBlob: Blob | null = null;
    let resultText = '';

    if (file) {
      // File-based conversion
      const buffer = await file.arrayBuffer();
      postMessage({ type: 'progress', value: 60 });
      // Apply conversion logic based on outputFormat
      resultBlob = new Blob([buffer], { type: 'application/octet-stream' });
    } else if (inputText) {
      // Text-based conversion
      postMessage({ type: 'progress', value: 60 });
      resultText = inputText; // Actual conversion logic would transform text here
      resultBlob = new Blob([resultText], { type: 'text/plain' });
    }

    postMessage({ type: 'progress', value: 90 });
    postMessage({ type: 'complete', data: { blob: resultBlob, text: resultText } });
  } catch (err) {
    postMessage({ type: 'error', errorCode: 'CONVERSION_FAILED', message: String(err) });
  }
});
