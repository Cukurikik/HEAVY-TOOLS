import type { PdfTask } from '../types';

export async function processDigitalSignature(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  // PAdES digital signature requires heavy cryptographic injection which is complex in pure client-side
  // We mock the blob generation for now, simulating server dispatch if a certificate was provided
  onProgress(20);
  const res = await fetch('/api/pdf/digital-signature', {
    method: 'POST',
    body: (() => {
      const fd = new FormData();
      fd.append('file', task.files[0]);
      if (task.options.cert) fd.append('cert', task.options.cert as string);
      return fd;
    })(),
  });
  
  onProgress(80);
  if (!res.ok) throw new Error("Digital Signature failed");
  
  const blob = await res.blob();
  onProgress(100);
  return blob;
}
