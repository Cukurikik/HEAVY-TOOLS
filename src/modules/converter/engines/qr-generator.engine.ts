import { ConverterTask } from '../types';
import QRCode from 'qrcode';

export const processQrGenerator = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  const input = task.options.directInput as string;
  if (!input) throw new Error("No Text/URL provided for QR Code.");

  onProgress(60);
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(input, { width: 500, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err, url) => {
      if (err) return reject(new Error("Failed to generate QR Code"));
      
      onProgress(80);
      // Convert Data URL to Blob
      const arr = url.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      onProgress(100);
      resolve(new Blob([u8arr], { type: mime }));
    });
  });
};
