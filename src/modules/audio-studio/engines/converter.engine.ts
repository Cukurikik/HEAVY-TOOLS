import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ConverterOptions { [key: string]: unknown; }
export async function buildConverterArgs(input: string, output: string, opts: ConverterOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const format = (opts.format as string) || "mp3";
  const bitrate = (opts.bitrate as string) || "192";
  const sampleRate = (opts.sampleRate as string) || "44100";
  const args = ["-i", input, "-ar", sampleRate];
  if (format === "mp3") args.push("-c:a", "libmp3lame", "-b:a", `${bitrate}k`);
  else if (format === "wav") args.push("-c:a", "pcm_s16le");
  else if (format === "flac") args.push("-c:a", "flac");
  else if (format === "ogg") args.push("-c:a", "libvorbis", "-b:a", `${bitrate}k`);
  else if (format === "aac") args.push("-c:a", "aac", "-b:a", `${bitrate}k`);
  args.push(output);
  return args;
}
export function getConverterOutputName(opts: ConverterOptions): string { return `output.${(opts.format as string) || "mp3"}`; }
export function getConverterMimeType(opts: ConverterOptions): string {
  const f = (opts.format as string) || "mp3";
  const map: Record<string, string> = { mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac", aac: "audio/aac" };
  return map[f] || "audio/mpeg";
}
