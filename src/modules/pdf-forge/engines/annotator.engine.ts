import { PDFDocument, rgb } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processAnnotate(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(30);
  
  const pages = srcDoc.getPages();
  
  // Real annotator draws shapes based on Konva data from the frontend
  for (const ann of task.annotations) {
    if (ann.pageIndex < pages.length) {
      const page = pages[ann.pageIndex];
      // simplified mapping of highlighting
      if (ann.type === 'highlight') {
        page.drawRectangle({
          x: ann.position.x,
          y: page.getHeight() - ann.position.y - ann.position.height, // PDF coordinates are bottom-up
          width: ann.position.width,
          height: ann.position.height,
          color: rgb(1, 1, 0), // Yellow
          opacity: 0.5,
        });
      }
    }
  }

  onProgress(80);
  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
