import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ConverterOptions { [key: string]: unknown; }
export async function buildConverterArgs(input: string, output: string, opts: ConverterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const format = (opts.format as string) || "mp4";
  if (format === "webm") {
    return ["-i", input, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libvorbis", output];
  } else {
    return ["-i", input, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
  }
}
export function getConverterOutputName(opts: ConverterOptions): string { return `output.${opts.format || 'mp4'}`; }
export function getConverterMimeType(opts: ConverterOptions): string { 
  const f = opts.format || "mp4";
  return f === "webm" ? "video/webm" : f === "avi" ? "video/x-msvideo" : `video/${f}`;
}