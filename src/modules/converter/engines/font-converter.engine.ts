import { ConverterTask } from '../types';

export const processFontConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'woff2');

  // Fonts (.ttf, .otf, .woff) require fontforge/fonttools on the server 
  const res = await fetch('/api/converter/font', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("Font format conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
