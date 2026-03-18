import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface TrimmerOptions {
  [key: string]: unknown;
}

/**
 * Video Trimmer Engine
 * Potong video presisi frame
 */
export function buildTrimmerArgs(
  input: string,
  output: string,
  opts: TrimmerOptions
): string[] {
  const start = (opts.start as string) || "00:00:00";
const end = (opts.end as string) || "00:00:10";
return ["-i", input, "-ss", start, "-to", end, "-c", "copy", output];
}

export function getTrimmerOutputName(opts: TrimmerOptions): string {
  return "output.mp4";
}

export function getTrimmerMimeType(opts: TrimmerOptions): string {
  return "video/mp4";
}
