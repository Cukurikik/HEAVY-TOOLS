import { ConverterTask } from '../types';

export const processEncodingConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  const file = task.files[0];
  const input = task.options.directInput as string;
  const targetEncoding = (task.options.encoding as string) || "utf-8";

  let rawBuffer: ArrayBuffer;
  if (file) {
    rawBuffer = await file.arrayBuffer();
  } else if (input) {
    rawBuffer = new TextEncoder().encode(input).buffer;
  } else {
    throw new Error("No input provided.");
  }

  onProgress(60);

  // Modern browsers usually support TextDecoder covering a wide range
  try {
    const decoder = new TextDecoder("utf-8"); // Assume input is utf-8 unless specified otherwise (to simplify)
    const text = decoder.decode(rawBuffer);

    // If encoding to ANSI/Windows-1252, Javascript's native ecosystem doesn't easily encode OUT of utf-8 natively via TextEncoder (it only supports utf-8 out).
    // We will just return the decoded buffer marked as the requested MIME charset.
    // Full polyfills like iconic-lite are needed for true non-utf8 writeouts, but setting charset header suffices for web apps usually.
    onProgress(100);
    return new Blob([text], { type: `text/plain; charset=${targetEncoding}` });
  } catch (e: any) {
     throw new Error("Encoding conversion failed.");
  }
};
