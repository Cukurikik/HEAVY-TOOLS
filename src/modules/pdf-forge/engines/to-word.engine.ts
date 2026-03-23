import type { PdfTask } from '../types';

export async function processToWord(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', 'docx');
  
  onProgress(20);
  
  const res = await fetch('/api/pdf/convert', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`To Word conversion failed: ${errorText}`);
  }
  
  const blob = await res.blob();
  onProgress(100);
  
  return blob;
}
