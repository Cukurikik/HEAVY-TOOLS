import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AudioExtractorOptions { [key: string]: unknown; }
export async function buildAudioExtractorArgs(input: string, output: string, opts: AudioExtractorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const format = (opts.audioFormat as string) || "mp3";
  const bitrate = (opts.audioBitrate as string) || "192";
  const sampleRate = (opts.sampleRate as string) || "44100";
  const args = ["-i", input, "-vn", "-ar", sampleRate];
  if (format === "wav" || format === "flac") {
    args.push("-c:a", format === "flac" ? "flac" : "pcm_s16le");
  } else if (format === "ogg") {
    args.push("-c:a", "libvorbis", "-b:a", `${bitrate}k`);
  } else if (format === "aac") {
    args.push("-c:a", "aac", "-b:a", `${bitrate}k`);
  } else {
    args.push("-c:a", "libmp3lame", "-b:a", `${bitrate}k`);
  }
  args.push(output);
  return args;
}
export function getAudioExtractorOutputName(opts: AudioExtractorOptions): string {
  const f = (opts.audioFormat as string) || "mp3";
  return `audio.${f}`;
}
export function getAudioExtractorMimeType(opts: AudioExtractorOptions): string {
  const f = (opts.audioFormat as string) || "mp3";
  const map: Record<string, string> = { mp3: "audio/mpeg", aac: "audio/aac", wav: "audio/wav", flac: "audio/flac", ogg: "audio/ogg" };
  return map[f] || "audio/mpeg";
}