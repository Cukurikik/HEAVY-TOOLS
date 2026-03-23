import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processDecrypt(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const password = (task.options.password as string) || '';
  onProgress(20);
  
  try {
    const _opts: any = { password };
    const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), _opts);
    onProgress(50);
    
    // Save without password to decrypt it permanently
    const pdfBytes = await srcDoc.save();
    onProgress(100);
    
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    if (error.message && error.message.includes('password')) {
       throw new Error("Incorrect password or document is not encrypted.");
    }
    throw error;
  }
}
