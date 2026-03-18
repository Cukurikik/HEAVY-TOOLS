import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface GifConverterOptions {
  [key: string]: unknown;
}

/**
 * GIF Converter Engine
 * Konversi video ke GIF
 */
export function buildGifConverterArgs(
  input: string,
  output: string,
  opts: GifConverterOptions
): string[] {
  const fps = (opts.fps as number) || 10;
const sc = (opts.scale as number) || 480;
return ["-i", input, "-vf", `fps=${fps},scale=${sc}:-1:flags=lanczos`, "output.gif"];
}

export function getGifConverterOutputName(opts: GifConverterOptions): string {
  return "output.gif";
}

export function getGifConverterMimeType(opts: GifConverterOptions): string {
  return "image/gif";
}
