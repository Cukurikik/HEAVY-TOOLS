import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ScreenRecorderOptions {
  [key: string]: unknown;
}

/**
 * Screen Recorder Engine
 * Rekam layar via getDisplayMedia()
 */
export function buildScreenRecorderArgs(
  input: string,
  output: string,
  opts: ScreenRecorderOptions
): string[] {
  return [];
}

export function getScreenRecorderOutputName(opts: ScreenRecorderOptions): string {
  return "output.mp4";
}

export function getScreenRecorderMimeType(opts: ScreenRecorderOptions): string {
  return "video/mp4";
}
