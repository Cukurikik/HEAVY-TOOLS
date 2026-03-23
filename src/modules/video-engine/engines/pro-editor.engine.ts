import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ProEditorOptions { [key: string]: unknown; }
export async function buildProEditorArgs(input: string, output: string, opts: ProEditorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const codec = (opts.codec as string) || "libx264";
  const crf = (opts.crf as number) || 23;
  const profile = (opts.profile as string) || "high";
  const preset = (opts.preset as string) || "medium";
  const tune = (opts.tune as string) || "none";
  const pixFmt = (opts.pixFmt as string) || "yuv420p";
  const args = ["-i", input, "-c:v", codec, "-crf", crf.toString()];
  if (codec === "libx264" || codec === "libx265") {
    args.push("-profile:v", profile, "-preset", preset);
    if (tune !== "none") args.push("-tune", tune);
  }
  args.push("-pix_fmt", pixFmt, "-c:a", "aac", output);
  return args;
}
export function getProEditorOutputName(opts: ProEditorOptions): string { return "output.mp4"; }
export function getProEditorMimeType(opts: ProEditorOptions): string { return "video/mp4"; }