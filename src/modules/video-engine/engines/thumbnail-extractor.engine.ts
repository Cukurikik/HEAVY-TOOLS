import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ThumbnailExtractorOptions { [key: string]: unknown; }
export async function buildThumbnailExtractorArgs(input: string, output: string, opts: ThumbnailExtractorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const timestamp = (opts.timestamp as string) || "00:00:01";
  return ["-i", input, "-ss", timestamp, "-frames:v", "1", "-q:v", "2", output];
}
export function getThumbnailExtractorOutputName(opts: ThumbnailExtractorOptions): string { return "thumbnail.png"; }
export function getThumbnailExtractorMimeType(opts: ThumbnailExtractorOptions): string { return "image/png"; }