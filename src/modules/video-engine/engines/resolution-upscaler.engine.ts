import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ResolutionUpscalerOptions { [key: string]: unknown; }
export async function buildResolutionUpscalerArgs(input: string, output: string, opts: ResolutionUpscalerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const scale = (opts.scale as number) || 2;
  return ["-i", input, "-vf", `scale=iw*${scale}:ih*${scale}:flags=bicubic`, "-c:a", "copy", output];
}
export function getResolutionUpscalerOutputName(opts: ResolutionUpscalerOptions): string { return "output.mp4"; }
export function getResolutionUpscalerMimeType(opts: ResolutionUpscalerOptions): string { return "video/mp4"; }