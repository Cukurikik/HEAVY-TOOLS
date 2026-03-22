/// <reference lib="webworker" />

self.onmessage = async (e: MessageEvent) => {
  const { id, type, payload } = e.data;
  try {
    const root = await navigator.storage.getDirectory();
    
    if (type === 'WRITE') {
      const { filename, fileData } = payload;
      const fileHandle = await root.getFileHandle(filename, { create: true });
      // OPFS SyncAccessHandle is only available in workers
      // We use createWritable() or createSyncAccessHandle() depending on browser support
      let resultUrl = '';
      if ('createSyncAccessHandle' in fileHandle) {
        const accessHandle = await (fileHandle as any).createSyncAccessHandle();
        accessHandle.write(new Uint8Array(await fileData.arrayBuffer()));
        accessHandle.flush();
        accessHandle.close();
      } else {
        const writable = await (fileHandle as any).createWritable();
        await writable.write(fileData);
        await writable.close();
      }
      self.postMessage({ id, status: 'success', filename });
    } else if (type === 'READ') {
      const { filename } = payload;
      const fileHandle = await root.getFileHandle(filename);
      const file = await fileHandle.getFile();
      self.postMessage({ id, status: 'success', file });
    } else if (type === 'DELETE') {
      const { filename } = payload;
      await root.removeEntry(filename);
      self.postMessage({ id, status: 'success' });
    }
  } catch (error) {
    self.postMessage({ id, status: 'error', error: String(error) });
  }
};
