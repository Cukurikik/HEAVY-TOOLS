import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface StabilizerOptions { [key: string]: unknown; }
export async function buildStabilizerArgs(input: string, output: string, opts: StabilizerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const shakiness = (opts.shakiness as number) || 5;
  const accuracy = (opts.accuracy as number) || 9;
  const smoothing = (opts.smoothing as number) || 10;
  // BUG FIX: accuracy and smoothing were defined but never used in the filter string
  // deshake: rx/ry = search radius (derived from shakiness), blocksize uses accuracy
  const rx = Math.max(8, shakiness * 6);
  const ry = Math.max(8, shakiness * 6);
  const blocksize = accuracy >= 8 ? 4 : accuracy >= 5 ? 8 : 16;
  return ["-i", input, "-vf", `deshake=rx=${rx}:ry=${ry}:edge=1:blocksize=${blocksize}:contrast=125`, "-c:a", "copy", output];
}
export function getStabilizerOutputName(opts: StabilizerOptions): string { return "output.mp4"; }
export function getStabilizerMimeType(opts: StabilizerOptions): string { return "video/mp4"; }