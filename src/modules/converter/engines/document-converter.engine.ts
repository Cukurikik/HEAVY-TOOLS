import { ConverterTask } from '../types';

export const processDocumentConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'pdf');

  // Documents (Word, PDF, Excel) require heavy server-side OS-level utilities (LibreOffice Engine)
  const res = await fetch('/api/converter/document', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("Document conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
