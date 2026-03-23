import { ConverterTask } from '../types';
import JsBarcode from 'jsbarcode';

export const processBarcodeGenerator = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  const input = task.options.directInput as string;
  if (!input) throw new Error("No value provided for Barcode.");

  const format = (task.options.format as string) || "CODE128";

  onProgress(60);
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, input, { format, width: 2, height: 100, displayValue: true });
      
      onProgress(80);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas to Blob failed"));
        onProgress(100);
        resolve(blob);
      }, 'image/png');
    } catch (e) {
      reject(new Error(`Failed to generate barcode. Ensure value matches the ${format} format rules.`));
    }
  });
};
