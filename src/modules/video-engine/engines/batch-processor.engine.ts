import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface BatchProcessorOptions {
  [key: string]: unknown;
}

/**
 * Batch Processor Engine
 * Proses multiple video sekaligus
 */
export function buildBatchProcessorArgs(
  input: string,
  output: string,
  opts: BatchProcessorOptions
): string[] {
  const op = (opts.batchOperation as string) || "compress";
const crf = (opts.batchCrf as number) || 28;
if(op==="compress") return ["-i", input, "-c:v", "libx264", "-crf", crf.toString(), "-preset", "fast", output];
if(op==="grayscale") return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
return ["-i", input, "-c", "copy", output];
}

export function getBatchProcessorOutputName(opts: BatchProcessorOptions): string {
  return "output.mp4";
}

export function getBatchProcessorMimeType(opts: BatchProcessorOptions): string {
  return "video/mp4";
}
