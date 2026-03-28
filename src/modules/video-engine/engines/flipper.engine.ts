import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface FlipperOptions { [key: string]: unknown; }
export async function buildFlipperArgs(input: string, output: string, opts: FlipperOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const direction = (opts.direction as string) || "horizontal";
  const filter = direction === "vertical" ? "vflip" : "hflip";
  return ["-i", input, "-vf", filter, "-c:a", "copy", output];
}
export function getFlipperOutputName(opts: FlipperOptions): string { return "output.mp4"; }
export function getFlipperMimeType(opts: FlipperOptions): string { return "video/mp4"; }