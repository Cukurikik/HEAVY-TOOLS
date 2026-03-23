import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TrimmerOptions { [key: string]: unknown; }
export async function buildTrimmerArgs(input: string, output: string, opts: TrimmerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const start = (opts.start as string) || "00:00:00";
  const end = (opts.end as string) || "00:00:10";
  const codec = (opts.codec as string) || "reencode";
  if (codec === "copy") {
    return ["-ss", start, "-to", end, "-i", input, "-c", "copy", output];
  }
  return ["-ss", start, "-to", end, "-i", input, "-c:v", "libx264", "-c:a", "aac", output];
}
export function getTrimmerOutputName(opts: TrimmerOptions): string { return `output.${(opts.format as string) || 'mp4'}`; }
export function getTrimmerMimeType(opts: TrimmerOptions): string {
  const f = (opts.format as string) || "mp4";
  return f === "webm" ? "video/webm" : `video/${f}`;
}