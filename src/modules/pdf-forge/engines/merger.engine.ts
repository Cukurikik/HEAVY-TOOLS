import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processMerge(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (let i = 0; i < task.files.length; i++) {
    const srcDoc = await PDFDocument.load(await task.files[i].arrayBuffer(), { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    
    copiedPages.forEach((page: any) => mergedPdf.addPage(page));
    onProgress(10 + (80 * (i + 1)) / task.files.length);
  }

  const pdfBytes = await mergedPdf.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
