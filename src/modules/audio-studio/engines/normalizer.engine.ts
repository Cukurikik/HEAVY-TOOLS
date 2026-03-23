import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface NormalizerOptions { [key: string]: unknown; }
export async function buildNormalizerArgs(input: string, output: string, opts: NormalizerOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const targetLoudness = (opts.targetLoudness as number) ?? -16;
  const truePeak = (opts.truePeak as number) ?? -1.5;
  const lra = (opts.lra as number) ?? 11;
  const mode = (opts.mode as string) || "loudnorm";
  if (mode === "peak") {
    return ["-i", input, "-af", `dynaudnorm=p=0.95:m=10`, output];
  }
  return ["-i", input, "-af", `loudnorm=I=${targetLoudness}:TP=${truePeak}:LRA=${lra}`, output];
}
export function getNormalizerOutputName(opts: NormalizerOptions): string { return "output.mp3"; }
export function getNormalizerMimeType(opts: NormalizerOptions): string { return "audio/mpeg"; }
