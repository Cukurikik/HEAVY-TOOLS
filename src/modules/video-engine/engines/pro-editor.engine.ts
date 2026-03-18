import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ProEditorOptions {
  [key: string]: unknown;
}

/**
 * Pro Editor Engine
 * CRF, Bitrate, Codec, Profile
 */
export function buildProEditorArgs(
  input: string,
  output: string,
  opts: ProEditorOptions
): string[] {
  const crf = (opts.crf as number) || 23;
const codec = (opts.codec as string) || "libx264";
const profile = (opts.profile as string) || "high";
const preset = (opts.preset as string) || "medium";
return ["-i", input, "-c:v", codec, "-crf", crf.toString(), "-profile:v", profile, "-preset", preset, "-c:a", "aac", output];
}

export function getProEditorOutputName(opts: ProEditorOptions): string {
  return "output.mp4";
}

export function getProEditorMimeType(opts: ProEditorOptions): string {
  return "video/mp4";
}
