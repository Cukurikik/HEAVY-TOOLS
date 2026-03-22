import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TrimmerOptions { [key: string]: unknown; }
export async function buildTrimmerArgs(input: string, output: string, opts: TrimmerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const start = (opts.start as string) || "00:00:00";
  const end = (opts.end as string) || "00:00:10";
  return ["-i", input, "-ss", start, "-to", end, "-c:v", "libx264", "-c:a", "aac", output];
}
export function getTrimmerOutputName(opts: TrimmerOptions): string { return "output.mp4"; }
export function getTrimmerMimeType(opts: TrimmerOptions): string { return "video/mp4"; }