import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface MetadataEditorOptions { [key: string]: unknown; }
export async function buildMetadataEditorArgs(input: string, output: string, opts: MetadataEditorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const metaArgs: string[] = ["-i", input];
  const fields: Record<string, string> = {
    title: (opts.title as string) || "",
    artist: (opts.author as string) || "",
    copyright: (opts.copyright as string) || "",
    date: (opts.year as string) || "",
    genre: (opts.genre as string) || "",
    comment: (opts.comment as string) || "",
  };
  for (const [key, val] of Object.entries(fields)) {
    if (val) metaArgs.push("-metadata", `${key}=${val}`);
  }
  metaArgs.push("-c", "copy", output);
  return metaArgs;
}
export function getMetadataEditorOutputName(opts: MetadataEditorOptions): string { return "output.mp4"; }
export function getMetadataEditorMimeType(opts: MetadataEditorOptions): string { return "video/mp4"; }