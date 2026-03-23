import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AudioSplitterOptions { [key: string]: unknown; }
export async function buildAudioSplitterArgs(input: string, output: string, opts: AudioSplitterOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const segDur = (opts.segmentDuration as number) || 30;
  return ["-i", input, "-f", "segment", "-segment_time", segDur.toString(), "-c", "copy", output];
}
export function getAudioSplitterOutputName(opts: AudioSplitterOptions): string { return "segment_%03d.mp3"; }
export function getAudioSplitterMimeType(opts: AudioSplitterOptions): string { return "audio/mpeg"; }
