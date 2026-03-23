import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface CompressorOptions { [key: string]: unknown; }
export async function buildCompressorArgs(input: string, output: string, opts: CompressorOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const threshold = (opts.threshold as number) ?? -20;
  const ratio = (opts.ratio as number) ?? 4;
  const attack = (opts.attack as number) ?? 5;
  const release = (opts.release as number) ?? 50;
  const knee = (opts.knee as number) ?? 2.83;
  const makeup = (opts.makeup as number) ?? 0;
  return ["-i", input, "-af", `acompressor=threshold=${threshold}dB:ratio=${ratio}:attack=${attack}:release=${release}:knee=${knee}:makeup=${makeup}dB`, output];
}
export function getCompressorOutputName(opts: CompressorOptions): string { return "output.mp3"; }
export function getCompressorMimeType(opts: CompressorOptions): string { return "audio/mpeg"; }
