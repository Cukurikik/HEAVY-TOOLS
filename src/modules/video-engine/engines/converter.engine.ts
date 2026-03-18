import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ConverterOptions {
  [key: string]: unknown;
}

/**
 * Video Converter Engine
 * Konversi format: MP4/WebM/MKV/MOV/AVI
 */
export function buildConverterArgs(
  input: string,
  output: string,
  opts: ConverterOptions
): string[] {
  const fmt = (opts.format as string) || "mp4";
const on = "output." + fmt;
if (fmt === "webm") return ["-i", input, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libvorbis", on];
return ["-i", input, "-c:v", "libx264", "-preset", "fast", on];
}

export function getConverterOutputName(opts: ConverterOptions): string {
  return `output.${(opts.format as string)||"mp4"}`;
}

export function getConverterMimeType(opts: ConverterOptions): string {
  return `video/${(opts.format as string)||"mp4"}`;
}
