import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface VideoSplitterOptions {
  [key: string]: unknown;
}

/**
 * Video Splitter Engine
 * Pecah video berdasarkan waktu
 */
export function buildVideoSplitterArgs(
  input: string,
  output: string,
  opts: VideoSplitterOptions
): string[] {
  const dur = (opts.segmentDuration as number) || 30;
return ["-i", input, "-c", "copy", "-f", "segment", "-segment_time", dur.toString(), "-reset_timestamps", "1", "segment_%03d.mp4"];
}

export function getVideoSplitterOutputName(opts: VideoSplitterOptions): string {
  return "segment_000.mp4";
}

export function getVideoSplitterMimeType(opts: VideoSplitterOptions): string {
  return "video/mp4";
}
