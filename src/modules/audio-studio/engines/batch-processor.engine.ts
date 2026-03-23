import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BatchProcessorOptions { [key: string]: unknown; }
export async function buildBatchProcessorArgs(input: string, output: string, opts: BatchProcessorOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const op = (opts.batchOperation as string) || "normalize";
  switch (op) {
    case "normalize":
      return ["-i", input, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", output];
    case "compress":
      return ["-i", input, "-af", "acompressor=threshold=-20dB:ratio=4:attack=5:release=50", output];
    case "convert":
      return ["-i", input, "-c:a", "libmp3lame", "-q:a", "2", output];
    case "trim": {
      const dur = (opts.trimDuration as number) || 30;
      return ["-i", input, "-t", dur.toString(), "-c", "copy", output];
    }
    default:
      return ["-i", input, "-c:a", "libmp3lame", "-q:a", "2", output];
  }
}
export function getBatchProcessorOutputName(opts: BatchProcessorOptions): string { return "output.mp3"; }
export function getBatchProcessorMimeType(opts: BatchProcessorOptions): string { return "audio/mpeg"; }
