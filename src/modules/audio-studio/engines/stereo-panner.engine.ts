import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface StereoPannerOptions { [key: string]: unknown; }
export async function buildStereoPannerArgs(input: string, output: string, opts: StereoPannerOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const pan = (opts.pan as number) ?? 0;
  const width = (opts.width as number) ?? 1;
  return ["-i", input, "-af", `stereotools=mpan=${pan}:sbal=${width}`, output];
}
export function getStereoPannerOutputName(opts: StereoPannerOptions): string { return "output.mp3"; }
export function getStereoPannerMimeType(opts: StereoPannerOptions): string { return "audio/mpeg"; }
