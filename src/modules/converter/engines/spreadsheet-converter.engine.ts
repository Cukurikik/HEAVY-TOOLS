import { ConverterTask } from '../types';

/**
 * Spreadsheet Converter Engine — Client-Side
 * Converts between XLSX ↔ CSV using SheetJS (xlsx library).
 * Falls back to server for complex XLSX with macros.
 */
export const processSpreadsheetConverter = async (
  task: ConverterTask,
  onProgress: (p: number) => void
): Promise<Blob> => {
  onProgress(10);

  const targetFormat = (task.options.format as string) || 'csv';
  const file = task.files[0];

  if (!file) throw new Error('No file provided for spreadsheet conversion.');

  onProgress(20);

  // Dynamic import to keep bundle size small
  let XLSX: typeof import('xlsx');
  try {
    XLSX = await import('xlsx');
  } catch {
    // Fallback to server if xlsx module is not installed
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    const res = await fetch('/api/converter/spreadsheet', {
      method: 'POST',
      body: formData,
    });

    onProgress(80);
    if (!res.ok) throw new Error('Spreadsheet conversion failed on server.');
    const blob = await res.blob();
    onProgress(100);
    return blob;
  }

  const buffer = await file.arrayBuffer();
  onProgress(40);

  const workbook = XLSX.read(buffer, { type: 'array' });
  onProgress(60);

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error('No sheets found in spreadsheet.');
  const sheet = workbook.Sheets[firstSheetName];

  let outputContent: string | ArrayBuffer;
  let mimeType: string;

  switch (targetFormat) {
    case 'csv': {
      outputContent = XLSX.utils.sheet_to_csv(sheet);
      mimeType = 'text/csv';
      break;
    }
    case 'json': {
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      outputContent = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      break;
    }
    case 'html': {
      outputContent = XLSX.utils.sheet_to_html(sheet);
      mimeType = 'text/html';
      break;
    }
    case 'xlsx': {
      // Re-write back to XLSX (useful for CSV → XLSX)
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, sheet, firstSheetName);
      const xlsxData = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
      onProgress(90);
      return new Blob([xlsxData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    }
    case 'ods': {
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, sheet, firstSheetName);
      const odsData = XLSX.write(newWb, { bookType: 'ods', type: 'array' });
      onProgress(90);
      return new Blob([odsData], {
        type: 'application/vnd.oasis.opendocument.spreadsheet',
      });
    }
    default: {
      outputContent = XLSX.utils.sheet_to_csv(sheet);
      mimeType = 'text/csv';
    }
  }

  onProgress(90);
  return new Blob([outputContent], { type: mimeType });
};
