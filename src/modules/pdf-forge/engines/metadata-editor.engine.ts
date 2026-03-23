import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processMetadataEdit(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(30);

  const { title, author, subject, keywords, producer, creator } = task.options;

  if (title) srcDoc.setTitle(title as string);
  if (author) srcDoc.setAuthor(author as string);
  if (subject) srcDoc.setSubject(subject as string);
  if (keywords) srcDoc.setKeywords((keywords as string).split(',').map(s => s.trim()));
  if (producer) srcDoc.setProducer(producer as string);
  if (creator) srcDoc.setCreator(creator as string);

  onProgress(80);
  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([new Uint8Array(pdfBytes) as any], { type: 'application/pdf' });
}
