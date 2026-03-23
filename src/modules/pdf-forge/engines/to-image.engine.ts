import type { PdfTask } from '../types';

export async function processToImage(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  // Mock implementations: returning the array buffer back or triggering 
  // a download of a ZIP file of images (handling in components).
  onProgress(50);
  
  // To avoid dealing with complex browser-canvas-to-blob-zip zip logic here, 
  // return a marker blob that the UI catches, or send to server.
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'png');
  formData.append('dpi', String(task.options.dpi || 300));
  
  const res = await fetch('/api/pdf/to-image', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  if (!res.ok) throw new Error("To Image conversion failed");
  
  const blob = await res.blob();
  onProgress(100);
  return blob; // ZIP blob
}
