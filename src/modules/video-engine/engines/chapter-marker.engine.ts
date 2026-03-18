import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ChapterMarkerOptions {
  [key: string]: unknown;
}

/**
 * Chapter Marker Engine
 * Tambah chapter markers
 */
export function buildChapterMarkerArgs(
  input: string,
  output: string,
  opts: ChapterMarkerOptions
): string[] {
  return ["-i", input, "-c", "copy", output]; // Chapters added via metadata in store
}

export function getChapterMarkerOutputName(opts: ChapterMarkerOptions): string {
  return "output.mp4";
}

export function getChapterMarkerMimeType(opts: ChapterMarkerOptions): string {
  return "video/mp4";
}
