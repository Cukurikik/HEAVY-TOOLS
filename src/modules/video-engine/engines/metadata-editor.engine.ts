import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface MetadataEditorOptions {
  [key: string]: unknown;
}

/**
 * Metadata Editor Engine
 * Edit title, author, copyright
 */
export function buildMetadataEditorArgs(
  input: string,
  output: string,
  opts: MetadataEditorOptions
): string[] {
  const t = (opts.title as string) || "";
const a = (opts.author as string) || "";
const c = (opts.copyright as string) || "";
const args2: string[] = ["-i", input];
if(t) args2.push("-metadata", `title=${t}`);
if(a) args2.push("-metadata", `artist=${a}`);
if(c) args2.push("-metadata", `copyright=${c}`);
args2.push("-c", "copy", output);
return args2;
}

export function getMetadataEditorOutputName(opts: MetadataEditorOptions): string {
  return "output.mp4";
}

export function getMetadataEditorMimeType(opts: MetadataEditorOptions): string {
  return "video/mp4";
}
