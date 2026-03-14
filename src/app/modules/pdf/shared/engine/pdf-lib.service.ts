import { Injectable } from '@angular/core';
import type { PdfMeta } from '../types/pdf.types';
import { PDFDocument } from 'pdf-lib';

@Injectable({ providedIn: 'root' })
export class PdfLibService {
  async getMetadata(file: File): Promise<PdfMeta> {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const title = doc.getTitle() || null;
      const author = doc.getAuthor() || null;
      const subject = doc.getSubject() || null;
      const creator = doc.getCreator() || null;
      const producer = doc.getProducer() || null;
      const creationDate = doc.getCreationDate() || null;
      const modificationDate = doc.getModificationDate() || null;
      
      const pageCount = doc.getPageCount();
      const isEncrypted = doc.isEncrypted;
      
      const numBytes = arrayBuffer.byteLength;
      const dimensions = doc.getPages().slice(0, 10).map(p => {
        const size = p.getSize();
        return { width: size.width, height: size.height };
      });
      
      return {
        filename: file.name,
        fileSizeMB: numBytes / (1024 * 1024),
        pageCount,
        pdfVersion: '1.7', // Assuming for now
        title, author, subject, creator, producer, creationDate, modificationDate,
        isEncrypted,
        isLinearized: false,
        hasAcroForm: !!doc.getForm(),
        hasFlattenedAnnotations: false,
        dimensions
      };
    } catch(e) {
      console.warn("pdf-lib metadata extraction warning:", e);
      // Fallback
      return {
        filename: file.name,
        fileSizeMB: file.size / (1024 * 1024),
        pageCount: 0,
        pdfVersion: 'Unknown',
        title: null, author: null, subject: null, creator: null, producer: null, creationDate: null, modificationDate: null,
        isEncrypted: false,
        isLinearized: false,
        hasAcroForm: false,
        hasFlattenedAnnotations: false,
        dimensions: []
      }
    }
  }
}
