import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AspectRatioOptions { [key: string]: unknown; }
export async function buildAspectRatioArgs(input: string, output: string, opts: AspectRatioOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const ratio = (opts.ratio as string) || "16:9";
  const mode = (opts.mode as string) || "crop";
  const barColor = (opts.barColor as string) || "black";

  // Parse ratio
  let rw = 16, rh = 9;
  const actualRatio = ratio === "custom" ? ((opts.customRatio as string) || "16:9") : ratio;
  const parts = actualRatio.split(":");
  if (parts.length === 2) { rw = parseFloat(parts[0]); rh = parseFloat(parts[1]); }

  if (mode === "crop") {
    return ["-i", input, "-vf", `crop='min(iw,ih*${rw}/${rh})':'min(ih,iw*${rh}/${rw})'`, "-c:a", "copy", output];
  } else {
    return ["-i", input, "-vf", `pad='max(iw,ih*${rw}/${rh})':'max(ih,iw*${rh}/${rw})':(ow-iw)/2:(oh-ih)/2:${barColor}`, "-c:a", "copy", output];
  }
}
export function getAspectRatioOutputName(opts: AspectRatioOptions): string { return "output.mp4"; }
export function getAspectRatioMimeType(opts: AspectRatioOptions): string { return "video/mp4"; }