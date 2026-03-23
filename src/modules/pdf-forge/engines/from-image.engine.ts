import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processFromImage(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const doc = await PDFDocument.create();
  
  for (let i = 0; i < task.files.length; i++) {
    const file = task.files[i];
    const imgBytes = await file.arrayBuffer();
    
    let img;
    // Basic support for common web formats. HEIC would need conversion first.
    if (file.type === 'image/png') {
       img = await doc.embedPng(imgBytes);
    } else {
       img = await doc.embedJpg(imgBytes);
    }
    
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    
    onProgress(10 + (80 * (i + 1)) / task.files.length);
  }

  const pdfBytes = await doc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
