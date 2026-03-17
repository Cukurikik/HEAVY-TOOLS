/// <reference lib="webworker" />

addEventListener('message', () => {
  try {
    self.postMessage({type:'progress',value:50});const result=JSON.stringify({peaks:[],lufs:-14});self.postMessage({type:'complete',data:result});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({ type: 'error', message: msg, errorCode: 'WORKER_CRASHED' });
  }
});
