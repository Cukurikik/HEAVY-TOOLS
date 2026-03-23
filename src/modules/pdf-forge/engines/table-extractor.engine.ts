import type { PdfTask } from '../types';

export async function processTableExtract(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', task.files[0]);
  
  onProgress(20);
  
  const res = await fetch('/api/pdf/table-extract', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Table extraction failed: ${errorText}`);
  }
  
  const blob = await res.blob();
  onProgress(100);
  
  // Returns a ZIP containing CSV files for all identified tables
  return blob;
}
