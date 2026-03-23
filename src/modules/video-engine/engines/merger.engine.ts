import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface MergerOptions { [key: string]: unknown; }
export async function buildMergerArgs(input: string, output: string, opts: MergerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg || !files) return [];
  const reencode = opts.reencode === true;
  let concatList = "";
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!f) continue;
    const name = `/opt/${f.name}`;
    concatList += `file '${name}'\n`;
  }
  await ffmpeg.writeFile("concat.txt", concatList);
  if (reencode) {
    return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
  }
  return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", output];
}
export function getMergerOutputName(opts: MergerOptions): string { return `output.${(opts.format as string) || 'mp4'}`; }
export function getMergerMimeType(opts: MergerOptions): string { return "video/mp4"; }