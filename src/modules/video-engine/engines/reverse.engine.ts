import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ReverseOptions {
  [key: string]: unknown;
}

/**
 * Video Reverser Engine
 * Balik video frame-by-frame
 */
export function buildReverseArgs(
  input: string,
  output: string,
  opts: ReverseOptions
): string[] {
  return ["-i", input, "-vf", "reverse", "-af", "areverse", output];
}

export function getReverseOutputName(opts: ReverseOptions): string {
  return "output.mp4";
}

export function getReverseMimeType(opts: ReverseOptions): string {
  return "video/mp4";
}
