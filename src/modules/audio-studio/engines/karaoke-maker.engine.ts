import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface KaraokeMakerOptions { [key: string]: unknown; }
export async function buildKaraokeMakerArgs(input: string, output: string, opts: KaraokeMakerOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const basscut = opts.bassCut === true;
  let af = "pan=stereo|c0=c0-c1|c1=c1-c0";
  if (basscut) af += ",highpass=f=200";
  return ["-i", input, "-af", af, output];
}
export function getKaraokeMakerOutputName(opts: KaraokeMakerOptions): string { return "output.mp3"; }
export function getKaraokeMakerMimeType(opts: KaraokeMakerOptions): string { return "audio/mpeg"; }
