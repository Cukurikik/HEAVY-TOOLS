import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BatchProcessorOptions { [key: string]: unknown; }
export async function buildBatchProcessorArgs(input: string, output: string, opts: BatchProcessorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  // Return the base arguments for a single file. The store loops through files.
  const batchOp = (opts.batchOperation as string) || "compress";
  const batchCrf = (opts.batchCrf as number) || 28;
  if (batchOp === "compress") {
    return ["-i", input, "-c:v", "libx264", "-crf", batchCrf.toString(), "-preset", "fast", "-c:a", "aac", output];
  } else if (batchOp === "grayscale") {
    return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
  } else {
    return ["-i", input, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
  }
}
export function getBatchProcessorOutputName(opts: BatchProcessorOptions): string { return "output.mp4"; }
export function getBatchProcessorMimeType(opts: BatchProcessorOptions): string { return "video/mp4"; }