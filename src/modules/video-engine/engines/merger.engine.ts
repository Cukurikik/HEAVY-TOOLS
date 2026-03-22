import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface MergerOptions { [key: string]: unknown; }
export async function buildMergerArgs(input: string, output: string, opts: MergerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg || !files) return [];
  let concatList = "";
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!f) continue;
    const ext = f.name.substring(f.name.lastIndexOf("."));
    const name = `merge_${i}${ext}`;
    const arrayBuffer = await f.arrayBuffer();
    await ffmpeg.writeFile(name, new Uint8Array(arrayBuffer));
    concatList += `file '${name}'\n`;
  }
  await ffmpeg.writeFile("concat.txt", concatList);
  return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", output];
}
export function getMergerOutputName(opts: MergerOptions): string { return "output.mp4"; }
export function getMergerMimeType(opts: MergerOptions): string { return "video/mp4"; }