import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TrimmerOptions { [key: string]: unknown; }
export async function buildTrimmerArgs(input: string, output: string, opts: TrimmerOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const start = (opts.start as string) || "00:00:00";
  const end = (opts.end as string) || "00:00:10";
  const format = (opts.format as string) || "mp3";
  const codec = (opts.codec as string) || "copy";
  if (codec === "copy") {
    return ["-ss", start, "-to", end, "-i", input, "-c", "copy", output];
  }
  return ["-ss", start, "-to", end, "-i", input, "-c:a", format === "mp3" ? "libmp3lame" : format === "flac" ? "flac" : format === "ogg" ? "libvorbis" : "aac", "-q:a", "2", output];
}
export function getTrimmerOutputName(opts: TrimmerOptions): string { return `output.${(opts.format as string) || "mp3"}`; }
export function getTrimmerMimeType(opts: TrimmerOptions): string {
  const f = (opts.format as string) || "mp3";
  const map: Record<string, string> = { mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac", aac: "audio/aac" };
  return map[f] || "audio/mpeg";
}
