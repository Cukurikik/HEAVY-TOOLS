import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface MetadataEditorOptions { [key: string]: unknown; }
export async function buildMetadataEditorArgs(input: string, output: string, opts: MetadataEditorOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const args = ["-i", input];
  const fields: Record<string, string> = {
    title: (opts.title as string) || "",
    artist: (opts.artist as string) || "",
    album: (opts.album as string) || "",
    date: (opts.year as string) || "",
    genre: (opts.genre as string) || "",
    track: (opts.track as string) || "",
  };
  for (const [key, val] of Object.entries(fields)) {
    if (val) args.push("-metadata", `${key}=${val}`);
  }
  args.push("-c", "copy", output);
  return args;
}
export function getMetadataEditorOutputName(opts: MetadataEditorOptions): string { return "output.mp3"; }
export function getMetadataEditorMimeType(opts: MetadataEditorOptions): string { return "audio/mpeg"; }
