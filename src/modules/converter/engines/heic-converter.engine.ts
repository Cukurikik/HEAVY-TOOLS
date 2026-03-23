import { ConverterTask } from '../types';
import heic2any from 'heic2any';

export const processHeicConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob[]> => {
  onProgress(10);
  
  if (!task.files || task.files.length === 0) throw new Error("No HEIC files provided.");
  
  const targetFormat = (task.options.format as string) || "image/jpeg";
  const quality = (task.options.quality as number) || 0.8;

  const conversionPromises: Promise<Blob>[] = [];
  
  task.files.forEach((file, idx) => {
    const promise = heic2any({
      blob: file,
      toType: targetFormat,
      quality: targetFormat === "image/jpeg" ? quality : undefined
    }).then(res => {
      onProgress(10 + Math.round((idx / task.files.length) * 80));
      // heic2any can return Blob | Blob[] for animations, normalize to Blob
      return Array.isArray(res) ? res[0] : res;
    });
    
    conversionPromises.push(promise);
  });

  const results = await Promise.all(conversionPromises);
  onProgress(100);
  return results; // Return all converted blobs
};
