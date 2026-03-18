import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface FlipperOptions {
  [key: string]: unknown;
}

/**
 * Video Flipper Engine
 * Flip horizontal/vertical
 */
export function buildFlipperArgs(
  input: string,
  output: string,
  opts: FlipperOptions
): string[] {
  const dir = (opts.direction as string) || "horizontal";
return ["-i", input, "-vf", dir === "vertical" ? "vflip" : "hflip", "-c:a", "copy", output];
}

export function getFlipperOutputName(opts: FlipperOptions): string {
  return "output.mp4";
}

export function getFlipperMimeType(opts: FlipperOptions): string {
  return "video/mp4";
}
