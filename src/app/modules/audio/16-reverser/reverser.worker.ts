/// <reference lib="webworker" />

addEventListener('message', (_event: MessageEvent) => {
  try {
    const{inputData}=_event.data.config;const reversed=new Float32Array(inputData).reverse();self.postMessage({type:'complete',data:reversed},[reversed.buffer]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({ type: 'error', message: msg, errorCode: 'WORKER_CRASHED' });
  }
});
