import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processEncrypt(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(40);
  
  const password = (task.options.password as string) || 'securepassword';
  const ownerPassword = (task.options.ownerPassword as string) || password;
  
  const options: any = {
    userPassword: password,
    ownerPassword: ownerPassword,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false,
    },
  };
  
  const pdfBytes = await srcDoc.save(options);
  
  onProgress(100);
  return new Blob([new Uint8Array(pdfBytes) as any], { type: 'application/pdf' });
}
