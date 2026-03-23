import { ConverterTask } from '../types';

export const processEbookConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'epub');

  // Ebooks (EPUB, MOBI) also require Calibre/Server tools.
  const res = await fetch('/api/converter/ebook', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("Ebook conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
