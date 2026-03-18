import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface AudioExtractorOptions {
  [key: string]: unknown;
}

/**
 * Audio Extractor Engine
 * Ekstrak audio tanpa re-encoding
 */
export function buildAudioExtractorArgs(
  input: string,
  output: string,
  opts: AudioExtractorOptions
): string[] {
  const fmt = (opts.format as string) || "mp3";
const on = "output." + fmt;
if(fmt==="mp3") return ["-i", input, "-vn", "-acodec", "libmp3lame", "-q:a", "2", on];
if(fmt==="wav") return ["-i", input, "-vn", "-acodec", "pcm_s16le", on];
return ["-i", input, "-vn", "-c:a", "copy", on];
}

export function getAudioExtractorOutputName(opts: AudioExtractorOptions): string {
  return `output.${(opts.format as string)||"mp3"}`;
}

export function getAudioExtractorMimeType(opts: AudioExtractorOptions): string {
  return (()=>{const f=(opts.format as string)||"mp3";return f==="mp3"?"audio/mpeg":f==="wav"?"audio/wav":"audio/"+f;})();
}
