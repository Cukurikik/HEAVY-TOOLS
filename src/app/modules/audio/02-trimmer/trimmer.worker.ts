/// <reference lib="webworker" />

addEventListener('message', (_event: MessageEvent) => {
  try {
    const{inputData,startTime,endTime,sampleRate,channels}=_event.data.config;const startSample=Math.round(startTime*sampleRate);const endSample=Math.round(endTime*sampleRate);const sliced=inputData.slice(startSample*channels,endSample*channels);self.postMessage({type:'complete',data:sliced},[sliced.buffer]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({ type: 'error', message: msg, errorCode: 'WORKER_CRASHED' });
  }
});
