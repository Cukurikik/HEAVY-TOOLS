import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ResolutionUpscalerOptions { [key: string]: unknown; }
export async function buildResolutionUpscalerArgs(input: string, output: string, opts: ResolutionUpscalerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const scale = (opts.scale as number) || 2;
  const algorithm = (opts.algorithm as string) || "lanczos";
  const targetRes = (opts.targetRes as string) || "auto";
  let scaleFilter: string;
  if (targetRes !== "auto") {
    scaleFilter = `scale=${targetRes}:flags=${algorithm}`;
  } else {
    scaleFilter = `scale=iw*${scale}:ih*${scale}:flags=${algorithm}`;
  }
  return ["-i", input, "-vf", scaleFilter, "-c:a", "copy", output];
}
export function getResolutionUpscalerOutputName(opts: ResolutionUpscalerOptions): string { return "output.mp4"; }
export function getResolutionUpscalerMimeType(opts: ResolutionUpscalerOptions): string { return "video/mp4"; }