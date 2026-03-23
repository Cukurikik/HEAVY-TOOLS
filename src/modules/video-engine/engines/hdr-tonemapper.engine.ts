import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface HdrTonemapperOptions { [key: string]: unknown; }
export async function buildHdrTonemapperArgs(input: string, output: string, opts: HdrTonemapperOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const algorithm = (opts.algorithm as string) || "hable";
  const desat = (opts.desaturation as number) ?? 0;
  return ["-i", input, "-vf", `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=${algorithm}:desat=${desat},zscale=t=bt709:m=bt709:r=tv,format=yuv420p`, "-c:a", "copy", output];
}
export function getHdrTonemapperOutputName(opts: HdrTonemapperOptions): string { return "output.mp4"; }
export function getHdrTonemapperMimeType(opts: HdrTonemapperOptions): string { return "video/mp4"; }