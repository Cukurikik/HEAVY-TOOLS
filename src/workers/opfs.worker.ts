// src/workers/opfs.worker.ts
// Native Web Worker for OPFS (Origin Private File System) heavy I/O operations (Phase 20)

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'WRITE_CHUNK') {
    // Simulated fast disk write bypassing RAM
    const { filename, chunkId } = payload;
    
    // Simulating OPFS SyncAccessHandle write latency
    setTimeout(() => {
      self.postMessage({ type: 'CHUNK_WRITTEN', filename, chunkId });
    }, 5);

  } else if (type === 'READ_STREAM') {
    const { filename } = payload;
    
    self.postMessage({ type: 'STREAM_OPENED', filename });
    // Simulate streaming chunks
    let offset = 0;
    const interval = setInterval(() => {
      offset += 1024 * 1024; // 1MB chunks
      self.postMessage({ type: 'CHUNK_READ', offset });
      
      if (offset >= 1024 * 1024 * 10) { // 10MB simulated file
        clearInterval(interval);
        self.postMessage({ type: 'STREAM_EOF', filename });
      }
    }, 50);

  } else if (type === 'TERMINATE') {
    self.close();
  }
};
