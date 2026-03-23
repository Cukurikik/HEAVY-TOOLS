import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

function parsePageRange(rangeStr: string, maxPages: number): number[] {
  if (!rangeStr || rangeStr.trim() === '') return Array.from({length: maxPages}, (_, i) => i);
  
  const pages = new Set<number>();
  const parts = rangeStr.split(',');
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= maxPages) pages.add(i - 1);
        }
      }
    } else {
      const page = parseInt(part.trim(), 10);
      if (!isNaN(page) && page > 0 && page <= maxPages) {
        pages.add(page - 1);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

export async function processSplit(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(20);

  const pageRangeStr = (task.options.pageRange as string) || '';
  const pagesToKeep = parsePageRange(pageRangeStr, srcDoc.getPageCount());
  
  if (pagesToKeep.length === 0) {
    throw new Error("Invalid page range specified.");
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pagesToKeep);
  copiedPages.forEach((page: any) => newDoc.addPage(page));
  
  onProgress(80);
  const pdfBytes = await newDoc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
