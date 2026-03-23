import { ConverterTask } from '../types';

export const processVectorConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'eps');

  // SVG <-> EPS/AI vectors usually run via Inkscape CLI on server
  const res = await fetch('/api/converter/vector', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("Vector conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
