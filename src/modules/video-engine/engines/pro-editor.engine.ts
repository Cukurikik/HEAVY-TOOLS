import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ProEditorOptions { [key: string]: unknown; }
export async function buildProEditorArgs(input: string, output: string, opts: ProEditorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const proCrf = (opts.crf as number) || 23;
  const codec = (opts.codec as string) || "libx264";
  const profile = (opts.profile as string) || "high";
  const proPreset = (opts.preset as string) || "medium";
  return ["-i", input, "-c:v", codec, "-crf", proCrf.toString(), "-profile:v", profile, "-preset", proPreset, "-c:a", "aac", output];
}
export function getProEditorOutputName(opts: ProEditorOptions): string { return "output.mp4"; }
export function getProEditorMimeType(opts: ProEditorOptions): string { return "video/mp4"; }