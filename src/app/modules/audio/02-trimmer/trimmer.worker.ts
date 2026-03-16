/// <reference lib="webworker" />

addEventListener('message', (event: MessageEvent) => {
  try {
    const {
      inputData,
      startTime,
      endTime,
      sampleRate,
      channels,
    } = event.data.config;

    const startSample = Math.round(startTime * sampleRate);
    const endSample = Math.round(endTime * sampleRate);

    const startIndex = startSample * channels;
    const endIndex = endSample * channels;

    const sliced = inputData.slice(startIndex, endIndex);

    self.postMessage({ type: 'complete', data: sliced }, [sliced.buffer]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({
      type: 'error',
      message: msg,
      errorCode: 'WORKER_CRASHED',
    });
  }
});
