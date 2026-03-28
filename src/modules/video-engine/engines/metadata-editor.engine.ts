import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface MetadataEditorOptions { [key: string]: unknown; }
export async function buildMetadataEditorArgs(input: string, output: string, opts: MetadataEditorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const title = (opts.title as string) || "";
  const author = (opts.author as string) || "";
  const copyright = (opts.copyright as string) || "";
  const metaArgs: string[] = ["-i", input];
  if (title) metaArgs.push("-metadata", `title=${title}`);
  if (author) metaArgs.push("-metadata", `artist=${author}`);
  if (copyright) metaArgs.push("-metadata", `copyright=${copyright}`);
  metaArgs.push("-c", "copy", output);
  return metaArgs;
}
export function getMetadataEditorOutputName(opts: MetadataEditorOptions): string { return "output.mp4"; }
export function getMetadataEditorMimeType(opts: MetadataEditorOptions): string { return "video/mp4"; }