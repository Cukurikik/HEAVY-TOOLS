import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ThumbnailExtractorOptions {
  [key: string]: unknown;
}

/**
 * Thumbnail Extractor Engine
 * Ekstrak frame sebagai gambar
 */
export function buildThumbnailExtractorArgs(
  input: string,
  output: string,
  opts: ThumbnailExtractorOptions
): string[] {
  const ts = (opts.timestamp as string) || "00:00:01";
return ["-i", input, "-ss", ts, "-vframes", "1", "-q:v", "2", "thumbnail.jpg"];
}

export function getThumbnailExtractorOutputName(opts: ThumbnailExtractorOptions): string {
  return "thumbnail.jpg";
}

export function getThumbnailExtractorMimeType(opts: ThumbnailExtractorOptions): string {
  return "image/jpeg";
}
