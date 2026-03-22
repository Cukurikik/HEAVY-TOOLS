import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ReverseOptions { [key: string]: unknown; }
export async function buildReverseArgs(input: string, output: string, opts: ReverseOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "reverse", "-af", "areverse", output];
}
export function getReverseOutputName(opts: ReverseOptions): string { return "output.mp4"; }
export function getReverseMimeType(opts: ReverseOptions): string { return "video/mp4"; }