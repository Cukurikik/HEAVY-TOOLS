import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AspectRatioOptions { [key: string]: unknown; }
export async function buildAspectRatioArgs(input: string, output: string, opts: AspectRatioOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const ratio = (opts.ratio as string) || "16:9";
  const mode = (opts.mode as string) || "crop";
  if (mode === "crop") {
    if (ratio === "16:9") return ["-i", input, "-vf", "crop=iw:iw*9/16", "-c:a", "copy", output];
    else if (ratio === "4:3") return ["-i", input, "-vf", "crop=ih*4/3:ih", "-c:a", "copy", output];
    else if (ratio === "1:1") return ["-i", input, "-vf", "crop=min(iw\\,ih):min(iw\\,ih)", "-c:a", "copy", output];
    else if (ratio === "9:16") return ["-i", input, "-vf", "crop=ih*9/16:ih", "-c:a", "copy", output];
    else return ["-i", input, "-vf", "crop=iw:iw*9/16", "-c:a", "copy", output];
  } else {
    if (ratio === "16:9") return ["-i", input, "-vf", "pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else if (ratio === "4:3") return ["-i", input, "-vf", "pad=ih*4/3:ih:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else if (ratio === "1:1") return ["-i", input, "-vf", "pad=max(iw\\,ih):max(iw\\,ih):(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else if (ratio === "9:16") return ["-i", input, "-vf", "pad=ih*9/16:ih:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else return ["-i", input, "-vf", "pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
  }
}
export function getAspectRatioOutputName(opts: AspectRatioOptions): string { return "output.mp4"; }
export function getAspectRatioMimeType(opts: AspectRatioOptions): string { return "video/mp4"; }