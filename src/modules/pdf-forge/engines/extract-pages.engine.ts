import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processExtractPages(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(20);

  // Extract pages based on array of indices (0-based)
  const pagesToExtract = (task.options.pages as number[]) || [0];
  const validPages = pagesToExtract.filter(i => i >= 0 && i < srcDoc.getPageCount());
  
  if (validPages.length === 0) {
     throw new Error("No valid pages specified for extraction.");
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validPages);
  copiedPages.forEach((page) => newDoc.addPage(page));
  
  onProgress(80);
  const pdfBytes = await newDoc.save();
  onProgress(100);
  
  return new Blob([new Uint8Array(pdfBytes) as any], { type: 'application/pdf' });
}
