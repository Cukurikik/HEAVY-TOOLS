import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface AspectRatioOptions {
  [key: string]: unknown;
}

/**
 * Aspect Ratio Tool Engine
 * Ubah aspect ratio crop/letterbox
 */
export function buildAspectRatioArgs(
  input: string,
  output: string,
  opts: AspectRatioOptions
): string[] {
  const r = (opts.ratio as string) || "16:9";
const m = (opts.mode as string) || "crop";
const filters: Record<string,Record<string,string>> = {
  crop:{"16:9":"crop=iw:iw*9/16","4:3":"crop=ih*4/3:ih","1:1":"crop=min(iw\\,ih):min(iw\\,ih)","9:16":"crop=ih*9/16:ih"},
  letterbox:{"16:9":"pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black","4:3":"pad=ih*4/3:ih:(ow-iw)/2:(oh-ih)/2:black","1:1":"pad=max(iw\\,ih):max(iw\\,ih):(ow-iw)/2:(oh-ih)/2:black","9:16":"pad=ih*9/16:ih:(ow-iw)/2:(oh-ih)/2:black"}
};
const vf = (filters[m] && filters[m][r]) || "crop=iw:iw*9/16";
return ["-i", input, "-vf", vf, "-c:a", "copy", output];
}

export function getAspectRatioOutputName(opts: AspectRatioOptions): string {
  return "output.mp4";
}

export function getAspectRatioMimeType(opts: AspectRatioOptions): string {
  return "video/mp4";
}
