import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface MergerOptions { [key: string]: unknown; }
export async function buildMergerArgs(input: string, output: string, opts: MergerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg || !files || files.length === 0) return [];
  const reencode = opts.reencode === true;
  let concatList = "";
  for (const f of files) {
    concatList += `file '/opt/${f.name}'\n`;
  }
  await ffmpeg.writeFile("concat.txt", concatList);
  if (reencode) {
    return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c:a", "libmp3lame", "-q:a", "2", output];
  }
  return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", output];
}
export function getMergerOutputName(opts: MergerOptions): string { return `output.${(opts.format as string) || "mp3"}`; }
export function getMergerMimeType(opts: MergerOptions): string { return "audio/mpeg"; }
