import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ThumbnailExtractorOptions { [key: string]: unknown; }
export async function buildThumbnailExtractorArgs(input: string, output: string, opts: ThumbnailExtractorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const timestamp = (opts.timestamp as string) || "00:00:01";
  const quality = (opts.quality as number) || 2;
  const args = ["-ss", timestamp, "-i", input, "-frames:v", "1", "-update", "1"];
  const fmt = (opts.imageFormat as string) || "png";
  if (fmt === "jpg") {
    args.push("-q:v", quality.toString());
  }
  args.push(output);
  return args;
}
export function getThumbnailExtractorOutputName(opts: ThumbnailExtractorOptions): string {
  const fmt = (opts.imageFormat as string) || "png";
  return `thumbnail.${fmt === "jpg" ? "jpg" : fmt}`;
}
export function getThumbnailExtractorMimeType(opts: ThumbnailExtractorOptions): string {
  const fmt = (opts.imageFormat as string) || "png";
  return fmt === "jpg" ? "image/jpeg" : fmt === "bmp" ? "image/bmp" : "image/png";
}