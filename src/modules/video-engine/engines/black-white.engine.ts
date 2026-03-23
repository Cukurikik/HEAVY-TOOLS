import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BlackWhiteOptions { [key: string]: unknown; }
export async function buildBlackWhiteArgs(input: string, output: string, opts: BlackWhiteOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const intensity = (opts.intensity as number) ?? 0;
  const contrast = (opts.contrast as number) ?? 1;
  const sepia = opts.sepia === true;
  let vf = `hue=s=${intensity}`;
  if (contrast !== 1) vf += `,eq=contrast=${contrast}`;
  if (sepia) vf += `,colorbalance=rs=0.3:gs=0.15:bs=-0.1`;
  return ["-i", input, "-vf", vf, "-c:a", "copy", output];
}
export function getBlackWhiteOutputName(opts: BlackWhiteOptions): string { return "output.mp4"; }
export function getBlackWhiteMimeType(opts: BlackWhiteOptions): string { return "video/mp4"; }