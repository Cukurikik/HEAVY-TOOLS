import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface StemSplitterOptions { [key: string]: unknown; }
export async function buildStemSplitterArgs(input: string, output: string, opts: StemSplitterOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const stem = (opts.stem as string) || "vocals";
  if (stem === "instruments") {
    return ["-i", input, "-af", "pan=stereo|c0=c0-c1|c1=c1-c0,volume=2", output];
  }
  // Vocals: extract center channel
  return ["-i", input, "-af", "pan=mono|c0=0.5*c0+0.5*c1,volume=1.5", output];
}
export function getStemSplitterOutputName(opts: StemSplitterOptions): string { return "output.mp3"; }
export function getStemSplitterMimeType(opts: StemSplitterOptions): string { return "audio/mpeg"; }
