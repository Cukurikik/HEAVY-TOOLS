import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface StabilizerOptions { [key: string]: unknown; }
export async function buildStabilizerArgs(input: string, output: string, opts: StabilizerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "deshake", "-c:a", "copy", output];
}
export function getStabilizerOutputName(opts: StabilizerOptions): string { return "output.mp4"; }
export function getStabilizerMimeType(opts: StabilizerOptions): string { return "video/mp4"; }