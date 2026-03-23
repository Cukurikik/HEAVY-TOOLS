import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface MasteringHubOptions { [key: string]: unknown; }
export async function buildMasteringHubArgs(input: string, output: string, opts: MasteringHubOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const loudness = (opts.loudness as number) ?? -14;
  const ceiling = (opts.ceiling as number) ?? -1.5;
  const lra = (opts.lra as number) ?? 11;
  const compThreshold = (opts.compThreshold as number) ?? -20;
  const compRatio = (opts.compRatio as number) ?? 4;
  return ["-i", input, "-af", `acompressor=threshold=${compThreshold}dB:ratio=${compRatio}:attack=5:release=50,loudnorm=I=${loudness}:TP=${ceiling}:LRA=${lra}`, output];
}
export function getMasteringHubOutputName(opts: MasteringHubOptions): string { return "output.mp3"; }
export function getMasteringHubMimeType(opts: MasteringHubOptions): string { return "audio/mpeg"; }
