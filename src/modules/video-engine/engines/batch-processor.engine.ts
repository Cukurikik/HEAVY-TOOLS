import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BatchProcessorOptions { [key: string]: unknown; }
export async function buildBatchProcessorArgs(input: string, output: string, opts: BatchProcessorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const batchOp = (opts.batchOperation as string) || "compress";
  const batchCrf = (opts.batchCrf as number) || 28;
  switch (batchOp) {
    case "compress":
      return ["-i", input, "-c:v", "libx264", "-crf", batchCrf.toString(), "-preset", "fast", "-c:a", "aac", output];
    case "grayscale":
      return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
    case "resize720":
      return ["-i", input, "-vf", "scale=1280:720:flags=lanczos", "-c:a", "copy", output];
    case "resize480":
      return ["-i", input, "-vf", "scale=854:480:flags=lanczos", "-c:a", "copy", output];
    case "rotate90":
      return ["-i", input, "-vf", "transpose=1", "-c:a", "copy", output];
    case "flipH":
      return ["-i", input, "-vf", "hflip", "-c:a", "copy", output];
    default:
      return ["-i", input, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
  }
}
export function getBatchProcessorOutputName(opts: BatchProcessorOptions): string { return "output.mp4"; }
export function getBatchProcessorMimeType(opts: BatchProcessorOptions): string { return "video/mp4"; }