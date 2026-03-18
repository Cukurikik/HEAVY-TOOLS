import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface HdrTonemapperOptions {
  [key: string]: unknown;
}

/**
 * HDR Tonemapper Engine
 * HDR ke SDR via tonemap
 */
export function buildHdrTonemapperArgs(
  input: string,
  output: string,
  opts: HdrTonemapperOptions
): string[] {
  return ["-i", input, "-vf", "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p", "-c:a", "copy", output];
}

export function getHdrTonemapperOutputName(opts: HdrTonemapperOptions): string {
  return "output.mp4";
}

export function getHdrTonemapperMimeType(opts: HdrTonemapperOptions): string {
  return "video/mp4";
}
