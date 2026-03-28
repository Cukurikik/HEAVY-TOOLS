import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BlackWhiteOptions { [key: string]: unknown; }
export async function buildBlackWhiteArgs(input: string, output: string, opts: BlackWhiteOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
}
export function getBlackWhiteOutputName(opts: BlackWhiteOptions): string { return "output.mp4"; }
export function getBlackWhiteMimeType(opts: BlackWhiteOptions): string { return "video/mp4"; }