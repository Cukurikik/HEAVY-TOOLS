import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';
import { processMerge } from './merger.engine';
import { processCompress } from './compressor.engine';
import { processWatermark } from './watermark.engine';

export async function processBatchProcess(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const operation = (task.options.batchType as string) || 'merge';
  
  // Advanced batch runner acts as a pipeline dispatcher
  switch (operation) {
    case 'merge':
      return await processMerge(task, onProgress);
      
    case 'compress': {
      // For compression, we return a ZIP
      const formData = new FormData();
      task.files.forEach(f => formData.append('files', f));
      formData.append('batchOperation', 'compress');
      onProgress(30);
      const res = await fetch('/api/pdf/batch', { method: 'POST', body: formData });
      onProgress(80);
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      onProgress(100);
      return blob;
    }
    
    case 'watermark':
      return await processWatermark(task, onProgress);
      
    default:
      throw new Error(`Unknown batch operation: ${operation}`);
  }
}
