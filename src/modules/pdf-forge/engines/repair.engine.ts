import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processRepair(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  // Repair attempts to load a structurally broken PDF, ignoring errors, and rebuilding the XREF table.
  try {
    const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { 
      ignoreEncryption: true,
      updateMetadata: true 
    });
    
    onProgress(50);
    const repairedDoc = await PDFDocument.create();
    const copiedPages = await repairedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    
    copiedPages.forEach(p => repairedDoc.addPage(p));
    
    onProgress(80);
    const pdfBytes = await repairedDoc.save({ useObjectStreams: false });
    onProgress(100);
    
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (err: any) {
    throw new Error(`Critical structure failure. Cannot repair. ${err.message}`);
  }
}
