import { PDFDocument, degrees } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processRotatePages(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  const angle = (task.options.angle as number) || 90;
  // If targetPages is empty, apply to all pages
  const targetPages = (task.options.pages as number[]) || Array.from({ length: srcDoc.getPageCount() }, (_, i) => i);
  
  onProgress(30);
  
  const pages = srcDoc.getPages();
  
  targetPages.forEach((index, i) => {
    if (index < pages.length) {
      const page = pages[index];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }
    onProgress(30 + (60 * (i + 1)) / targetPages.length);
  });

  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([new Uint8Array(pdfBytes) as any], { type: 'application/pdf' });
}
