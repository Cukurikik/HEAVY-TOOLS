import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface SubtitleBurnerOptions {
  [key: string]: unknown;
}

/**
 * Subtitle Burner Engine
 * Burn subtitle SRT ke video
 */
export function buildSubtitleBurnerArgs(
  input: string,
  output: string,
  opts: SubtitleBurnerOptions
): string[] {
  return ["-i", input, "-vf", "drawtext=text='Sample':x=10:y=(h-40):fontsize=24:fontcolor=white", "-c:a", "copy", output];
}

export function getSubtitleBurnerOutputName(opts: SubtitleBurnerOptions): string {
  return "output.mp4";
}

export function getSubtitleBurnerMimeType(opts: SubtitleBurnerOptions): string {
  return "video/mp4";
}
