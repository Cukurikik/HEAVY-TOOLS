import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface PodcastEnhancerOptions { [key: string]: unknown; }
export async function buildPodcastEnhancerArgs(input: string, output: string, opts: PodcastEnhancerOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const highpassFreq = (opts.highpass as number) ?? 80;
  const loudness = (opts.loudness as number) ?? -16;
  const deesser = opts.deesser !== false;
  let af = `highpass=f=${highpassFreq},acompressor=threshold=-18dB:ratio=3:attack=10:release=100,loudnorm=I=${loudness}:TP=-1.5:LRA=11`;
  if (deesser) af += `,highshelf=g=-6:f=6000`;
  return ["-i", input, "-af", af, output];
}
export function getPodcastEnhancerOutputName(opts: PodcastEnhancerOptions): string { return "output.mp3"; }
export function getPodcastEnhancerMimeType(opts: PodcastEnhancerOptions): string { return "audio/mpeg"; }
