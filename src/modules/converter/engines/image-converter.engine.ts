import { ConverterTask } from '../types';

export const processImageConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  // Using native browser canvas API for rapid, memory-safe image conversions without FFmpeg overhead
  return new Promise((resolve, reject) => {
    onProgress(10);
    const file = task.files[0];
    const targetFormat = (task.options.format as string) || "image/png";
    const quality = (task.options.quality as number) || 0.9;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      onProgress(40);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Canvas context failed"));
      
      ctx.drawImage(img, 0, 0);
      onProgress(70);
      
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          onProgress(100);
          if (blob) resolve(blob);
          else reject(new Error("Blob generation failed"));
        },
        targetFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = url;
  });
};
