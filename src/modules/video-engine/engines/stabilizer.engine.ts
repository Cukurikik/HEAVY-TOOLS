import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface StabilizerOptions {
  [key: string]: unknown;
}

/**
 * Video Stabilizer Engine
 * Stabilisasi video dengan deshake filter
 */
export function buildStabilizerArgs(
  input: string,
  output: string,
  opts: StabilizerOptions
): string[] {
  return ["-i", input, "-vf", "deshake", "-c:a", "copy", output];
}

export function getStabilizerOutputName(opts: StabilizerOptions): string {
  return "output.mp4";
}

export function getStabilizerMimeType(opts: StabilizerOptions): string {
  return "video/mp4";
}
