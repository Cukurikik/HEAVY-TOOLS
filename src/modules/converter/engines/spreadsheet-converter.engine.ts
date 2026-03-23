import { ConverterTask } from '../types';

export const processSpreadsheetConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const formData = new FormData();
  formData.append('file', task.files[0]);
  formData.append('targetFormat', (task.options.format as string) || 'csv');

  // Excel (.xlsx, .ods) usually utilize SheetJS or server tools. Sending to server.
  const res = await fetch('/api/converter/spreadsheet', {
    method: 'POST',
    body: formData,
  });

  onProgress(80);
  if (!res.ok) throw new Error("Spreadsheet conversion failed on server.");

  const blob = await res.blob();
  onProgress(100);
  return blob;
};
