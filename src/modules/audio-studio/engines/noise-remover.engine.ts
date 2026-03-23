import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface NoiseRemoverOptions { [key: string]: unknown; }
export async function buildNoiseRemoverArgs(input: string, output: string, opts: NoiseRemoverOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const noiseFloor = (opts.noiseFloor as number) ?? -30;
  const reduction = (opts.reduction as number) ?? 12;
  return ["-i", input, "-af", `afftdn=nf=${noiseFloor}:nr=${reduction}:nt=w`, output];
}
export function getNoiseRemoverOutputName(opts: NoiseRemoverOptions): string { return "output.mp3"; }
export function getNoiseRemoverMimeType(opts: NoiseRemoverOptions): string { return "audio/mpeg"; }
