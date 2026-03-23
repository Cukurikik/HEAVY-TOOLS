import type { PdfTask } from '../types';

export async function processCompare(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  if (task.files.length < 2) {
     throw new Error("Compare tool requires exactly 2 PDF files.");
  }

  const formData = new FormData();
  formData.append('file1', task.files[0]);
  formData.append('file2', task.files[1]);
  
  onProgress(20);
  
  const res = await fetch('/api/pdf/compare', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Comparison failed: ${errorText}`);
  }
  
  const blob = await res.blob();
  onProgress(100);
  
  // Return an annotated PDF outlining the differences
  return blob;
}
