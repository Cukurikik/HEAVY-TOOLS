import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface BlackWhiteOptions {
  [key: string]: unknown;
}

/**
 * Black & White Engine
 * Grayscale via hue=s=0
 */
export function buildBlackWhiteArgs(
  input: string,
  output: string,
  opts: BlackWhiteOptions
): string[] {
  return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
}

export function getBlackWhiteOutputName(opts: BlackWhiteOptions): string {
  return "output.mp4";
}

export function getBlackWhiteMimeType(opts: BlackWhiteOptions): string {
  return "video/mp4";
}
