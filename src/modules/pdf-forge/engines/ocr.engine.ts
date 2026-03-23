import type { PdfTask } from '../types';
import Tesseract from 'tesseract.js';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF JS worker (Must point to local or CDN matching the version)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function processOcr(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const lang = (task.options.language as string) || 'eng';
  onProgress(10);
  
  const arrayBuffer = await task.files[0].arrayBuffer();
  
  // Create a new PDF to house the text layer
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pdfjsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const numPages = pdfjsDoc.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfjsDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    
    // Render page to canvas to pass to Tesseract
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    
    await page.render({ canvasContext: ctx!, viewport } as any).promise;
    onProgress(10 + (40 * i) / numPages);

    // Run Tesseract OCR on the canvas
    const { data: { text } } = await Tesseract.recognize(canvas, lang);
    onProgress(50 + (40 * i) / numPages);

    // Overlay invisible text on the PDF (basic implementation)
    // For a true sandwich PDF, you'd calculate bounding boxes, but this adds it as a searchable layer
    const pdfPage = pdfDoc.getPage(i - 1);
    pdfPage.drawText(text, {
      x: 0,
      y: 0,
      size: 1, // Invisible or very small
      color: rgb(1, 1, 1),
      opacity: 0
    });
  }

  const pdfBytes = await pdfDoc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
