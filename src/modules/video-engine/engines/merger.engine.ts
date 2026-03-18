import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface MergerOptions {
  [key: string]: unknown;
}

/**
 * Video Merger Engine
 * Gabungkan multiple video via concat
 */
export function buildMergerArgs(
  input: string,
  output: string,
  opts: MergerOptions
): string[] {
  return ["-i", input, "-c", "copy", output]; // Multi-file handled by store
}

export function getMergerOutputName(opts: MergerOptions): string {
  return "output.mp4";
}

export function getMergerMimeType(opts: MergerOptions): string {
  return "video/mp4";
}
