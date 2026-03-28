import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SubtitleBurnerOptions { [key: string]: unknown; }
export async function buildSubtitleBurnerArgs(input: string, output: string, opts: SubtitleBurnerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if(!ffmpeg) return [];
  const subText = (opts.subtitleText as string) || "Sample Subtitle";
  const subStart = (opts.subStart as string) || "00:00:00,000";
  const subEnd = (opts.subEnd as string) || "00:00:10,000";
  const srtContent = `1\n${subStart} --> ${subEnd}\n${subText}`;
  await ffmpeg.writeFile("sub.srt", srtContent);
  return ["-i", input, "-vf", "subtitles=sub.srt", "-c:a", "copy", output];
}
export function getSubtitleBurnerOutputName(opts: SubtitleBurnerOptions): string { return "output.mp4"; }
export function getSubtitleBurnerMimeType(opts: SubtitleBurnerOptions): string { return "video/mp4"; }