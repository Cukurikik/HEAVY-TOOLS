import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ResolutionUpscalerOptions {
  [key: string]: unknown;
}

/**
 * AI Upscaler Engine
 * Upscale resolusi via bicubic
 */
export function buildResolutionUpscalerArgs(
  input: string,
  output: string,
  opts: ResolutionUpscalerOptions
): string[] {
  const sc = (opts.scale as number) || 2;
return ["-i", input, "-vf", `scale=iw*${sc}:ih*${sc}:flags=bicubic`, "-c:a", "copy", output];
}

export function getResolutionUpscalerOutputName(opts: ResolutionUpscalerOptions): string {
  return "output.mp4";
}

export function getResolutionUpscalerMimeType(opts: ResolutionUpscalerOptions): string {
  return "video/mp4";
}
