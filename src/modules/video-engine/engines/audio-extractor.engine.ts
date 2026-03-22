import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AudioExtractorOptions { [key: string]: unknown; }
export async function buildAudioExtractorArgs(input: string, output: string, opts: AudioExtractorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const audioFmt = (opts.format as string) || "mp3";
  if (audioFmt === "mp3") {
    return ["-i", input, "-vn", "-acodec", "libmp3lame", "-q:a", "2", output];
  } else if (audioFmt === "wav") {
    return ["-i", input, "-vn", "-acodec", "pcm_s16le", output];
  } else {
    return ["-i", input, "-vn", "-c:a", "aac", output];
  }
}
export function getAudioExtractorOutputName(opts: AudioExtractorOptions): string { return `output.${(opts.format as string) || 'mp3'}`; }
export function getAudioExtractorMimeType(opts: AudioExtractorOptions): string { 
  const audioFmt = (opts.format as string) || "mp3";
  return audioFmt === "mp3" ? "audio/mpeg" : audioFmt === "wav" ? "audio/wav" : audioFmt === "aac" ? "audio/aac" : `audio/${audioFmt}`;
}