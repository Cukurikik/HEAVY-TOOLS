import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface VideoSplitterOptions { [key: string]: unknown; }
export async function buildVideoSplitterArgs(input: string, output: string, opts: VideoSplitterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const segDuration = (opts.segmentDuration as number) || 30;
  return ["-i", input, "-c", "copy", "-f", "segment", "-segment_time", segDuration.toString(), "-reset_timestamps", "1", output];
}
export function getVideoSplitterOutputName(opts: VideoSplitterOptions): string { return "segment_%03d.mp4"; }
export function getVideoSplitterMimeType(opts: VideoSplitterOptions): string { return "video/mp4"; }