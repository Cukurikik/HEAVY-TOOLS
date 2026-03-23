import { ConverterTask } from '../types';
import JSZip from 'jszip';

export const processArchiveCreator = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(10);
  
  if (!task.files || task.files.length === 0) throw new Error("No files provided to archive.");

  const zip = new JSZip();
  onProgress(30);
  
  for (let i = 0; i < task.files.length; i++) {
    const file = task.files[i];
    zip.file(file.name, file);
  }

  onProgress(60);
  
  const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }, metadata => {
    onProgress(60 + (metadata.percent * 0.4));
  });

  onProgress(100);
  return content;
};
