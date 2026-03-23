import type { PdfTask } from '../types';

export async function processFromHtml(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const formData = new FormData();
  if (task.files.length > 0) {
    formData.append('file', task.files[0]);
  }
  
  if (task.options.url) {
    formData.append('url', task.options.url as string);
  }
  
  onProgress(20);
  
  const res = await fetch('/api/pdf/from-html', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTML to PDF conversion failed: ${errorText}`);
  }
  
  const blob = await res.blob();
  onProgress(100);
  
  return blob;
}
