/// <reference lib="webworker" />

addEventListener('message', () => {
  try {
    self.postMessage({type:'progress',value:50});self.postMessage({type:'complete',data:JSON.stringify([{start:0,end:1,text:'Transcription placeholder'}])});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown worker error';
    self.postMessage({ type: 'error', message: msg, errorCode: 'WORKER_CRASHED' });
  }
});
