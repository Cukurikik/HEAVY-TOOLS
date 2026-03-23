import type { PdfTask } from '../types';

export async function processXrefAnalyze(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  // This tool doesn't output a PDF, it outputs a TXT log file with the XREF table
  const formData = new FormData();
  formData.append('file', task.files[0]);
  
  onProgress(20);
  
  const res = await fetch('/api/pdf/xref-analyze', {
    method: 'POST',
    body: formData,
  });
  
  onProgress(80);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`XREF Analyzation failed: ${errorText}`);
  }
  
  const blob = await res.blob();
  onProgress(100);
  
  return blob; // Type will be handled by UI (e.g. text/plain)
}
