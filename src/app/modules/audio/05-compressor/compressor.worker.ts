/// <reference lib="webworker" />

addEventListener('message', (event: MessageEvent) => {
  try {
    const cfg=event.data.config;self.postMessage({type:'progress',value:50});self.postMessage({type:'complete',data:cfg.inputData});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({ type: 'error', message: msg, errorCode: 'WORKER_CRASHED' });
  }
});
