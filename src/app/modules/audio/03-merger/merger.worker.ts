/// <reference lib="webworker" />

addEventListener('message', (_event: MessageEvent) => {
  try {
    const{files}=_event.data.config;self.postMessage({type:'progress',value:50});self.postMessage({type:'complete',data:files[0]});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({ type: 'error', message: msg, errorCode: 'WORKER_CRASHED' });
  }
});
