import { PDFDocument, rgb } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processWatermark(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  const text = (task.options.text as string) || 'CONFIDENTIAL';
  const fontSize = (task.options.fontSize as number) || 64;
  const opacity = (task.options.opacity as number) || 0.25;
  const rotation = (task.options.rotation as number) || 45;

  const pages = srcDoc.getPages();
  
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (text.length * fontSize) / 4, // Rough center
      y: height / 2 - fontSize / 2,
      size: fontSize,
      opacity,
      color: rgb(0.8, 0, 0), // Red
      rotate: { type: 'degrees' as any, angle: rotation },
    });
    onProgress(10 + (80 * (i + 1)) / pages.length);
  });

  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([new Uint8Array(pdfBytes) as any], { type: 'application/pdf' });
}
