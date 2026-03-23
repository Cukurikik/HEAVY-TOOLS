import { ConverterTask } from '../types';

export const processRawConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'image/jpeg');

  // RAW images (.CR2, .NEF) are huge and typically converted via LibRaw on a server API to save mobile RAM limits
  const res = await fetch('/api/converter/raw', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("RAW image conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
