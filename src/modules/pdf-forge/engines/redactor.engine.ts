import { PDFDocument, rgb } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processRedact(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(30);
  
  const pages = srcDoc.getPages();
  const redactions = task.annotations.filter(a => a.type === 'redaction');
  
  for (const ann of redactions) {
    if (ann.pageIndex < pages.length) {
      const page = pages[ann.pageIndex];
      // Draw solid black rectangle over the redacted area
      page.drawRectangle({
        x: ann.position.x,
        y: page.getHeight() - ann.position.y - ann.position.height,
        width: ann.position.width,
        height: ann.position.height,
        color: rgb(0, 0, 0), // Solid Black
      });
    }
  }

  // A true redaction would also strip text from the PDF stream, but this is a visual block
  onProgress(80);
  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
