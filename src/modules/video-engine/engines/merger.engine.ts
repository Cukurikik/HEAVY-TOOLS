import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
export interface MergerOptions { [key: string]: unknown; }
export async function buildMergerArgs(input: string, output: string, opts: MergerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg || !files) return [];
  let concatList = "";
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!f) continue;
    const ext = f.name.substring(f.name.lastIndexOf("."));
    const name = `merge_${i}${ext}`;
    await ffmpeg.writeFile(name, await fetchFile(f));
    concatList += `file '${name}'\n`;
  }
  await ffmpeg.writeFile("concat.txt", concatList);
  return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", output];
}
export function getMergerOutputName(opts: MergerOptions): string { return "output.mp4"; }
export function getMergerMimeType(opts: MergerOptions): string { return "video/mp4"; }