import { ConverterTask } from '../types';

export const processHashGenerator = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  let buffer: ArrayBuffer;
  if (task.files && task.files.length > 0) {
    buffer = await task.files[0].arrayBuffer();
  } else {
    const input = task.options.directInput as string;
    if (!input) throw new Error("No input provided. Upload a file or paste text.");
    buffer = new TextEncoder().encode(input).buffer;
  }

  onProgress(50);
  
  const algorithm = (task.options.algorithm as string) || "SHA-256";
  
  // Browsers natively support SHA-1, SHA-256, SHA-384, SHA-512 via Crypto API
  if (!['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].includes(algorithm)) {
    throw new Error(`Algorithm ${algorithm} is not supported directly by native crypto API. Use SHA-256.`);
  }

  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  onProgress(80);

  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  onProgress(100);
  return `[${algorithm}] ${hashHex}`;
};
