/// <reference lib="webworker" />
import { PDFDocument } from 'pdf-lib';

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
     const file = config.file as File;
     if(!file) throw new Error("No Input File");
     postMessage({ type: 'progress', value: 30 });
     
     // Core manipulation (simulate for now as robust worker base)
     const arrayBuffer = await file.arrayBuffer();
     const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
     doc.setTitle('OMNI-TOOL MODIFIED');
     
     const modifiedBuffer = await doc.save();
     const outputBlob = new Blob([modifiedBuffer as unknown as BlobPart], { type: 'application/pdf' });
     
     postMessage({ type: 'progress', value: 100 });
     postMessage({ type: 'complete', data: outputBlob });
  } catch(e: unknown) {
     postMessage({ type: 'error', errorCode: 'WORKER_CRASHED', message: (e as Error).message });
  }
});
