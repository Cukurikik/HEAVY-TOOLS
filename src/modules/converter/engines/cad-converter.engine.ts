import { ConverterTask } from '../types';

export const processCadConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'pdf');

  // CAD files (.dwg, .dxf) require LibreCAD / QCAD CLI tools on server
  const res = await fetch('/api/converter/cad', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("CAD conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
