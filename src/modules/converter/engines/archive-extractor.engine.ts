import { ConverterTask } from '../types';
import JSZip from 'jszip';

export const processArchiveExtractor = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob[]> => {
  onProgress(10);
  
  const file = task.files[0];
  if (!file) throw new Error("No archive provided.");

  const zip = new JSZip();
  try {
    await zip.loadAsync(file);
    onProgress(50);
    
    // JSZip iterates files, we will extract them all
    const extractionPromises: Promise<Blob>[] = [];
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        // Just extract all raw files as individual blobs
        extractionPromises.push(zipEntry.async('blob'));
      }
    });

    const results = await Promise.all(extractionPromises);
    onProgress(100);
    return results; // Multiple files returned!
  } catch (e) {
    throw new Error("Failed to extract Archive. It might be corrupted or password protected.");
  }
};
