import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BassBoosterOptions { [key: string]: unknown; }
export async function buildBassBoosterArgs(input: string, output: string, opts: BassBoosterOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const gain = (opts.gain as number) ?? 10;
  const frequency = (opts.frequency as number) ?? 100;
  const width = (opts.width as number) ?? 200;
  return ["-i", input, "-af", `bass=g=${gain}:f=${frequency}:w=${width}`, output];
}
export function getBassBoosterOutputName(opts: BassBoosterOptions): string { return "output.mp3"; }
export function getBassBoosterMimeType(opts: BassBoosterOptions): string { return "audio/mpeg"; }
