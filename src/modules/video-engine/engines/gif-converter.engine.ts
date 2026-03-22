import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface GifConverterOptions { [key: string]: unknown; }
export async function buildGifConverterArgs(input: string, output: string, opts: GifConverterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const gifFps = (opts.fps as number) || 10;
  const gifScale = (opts.scale as number) || 480;
  return ["-i", input, "-vf", `fps=${gifFps},scale=${gifScale}:-1:flags=lanczos`, output];
}
export function getGifConverterOutputName(opts: GifConverterOptions): string { return "output.gif"; }
export function getGifConverterMimeType(opts: GifConverterOptions): string { return "image/gif"; }