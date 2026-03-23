import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processReorderPages(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(20);

  // 'order' should be an array of the original page indices in the new desired order
  const newOrder = (task.options.order as number[]) || Array.from({ length: srcDoc.getPageCount() }, (_, i) => i);
  const validOrder = newOrder.filter(i => i >= 0 && i < srcDoc.getPageCount());

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validOrder);
  copiedPages.forEach((page) => newDoc.addPage(page));
  
  onProgress(80);
  const pdfBytes = await newDoc.save();
  onProgress(100);
  
  return new Blob([new Uint8Array(pdfBytes) as any], { type: 'application/pdf' });
}
