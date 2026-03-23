import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processCropPages(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(30);

  const pages = srcDoc.getPages();
  const cropBox = (task.options.cropBox as Record<string, number>) || { x: 0, y: 0, w: 400, h: 600 };
  
  // CropBox defines the visible region. The origin (0,0) is bottom-left in PDF coordinate space.
  pages.forEach((page, i) => {
    page.setCropBox(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
    onProgress(30 + (60 * (i + 1)) / pages.length);
  });

  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
