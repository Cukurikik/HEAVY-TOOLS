import type { PdfTask } from '../types';

export async function processCompress(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('compressionLevel', (task.options.level as string) || 'recommended');
  
  onProgress(20);
  
  // Since compression involves ghostscript/backend optimization, we dispatch to route handler
  const res = await fetch('/api/pdf/compress', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Compression failed: ${errorText}`);
  }
  
  const blob = await res.blob();
  onProgress(100);
  
  return blob;
}
