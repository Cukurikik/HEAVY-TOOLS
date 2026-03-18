import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface CompressorOptions {
  [key: string]: unknown;
}

/**
 * Video Compressor Engine
 * Kompresi dengan kontrol CRF dan Bitrate
 */
export function buildCompressorArgs(
  input: string,
  output: string,
  opts: CompressorOptions
): string[] {
  const crf = (opts.crf as number) || 28;
const preset = (opts.preset as string) || "medium";
return ["-i", input, "-c:v", "libx264", "-crf", crf.toString(), "-preset", preset, output];
}

export function getCompressorOutputName(opts: CompressorOptions): string {
  return "output.mp4";
}

export function getCompressorMimeType(opts: CompressorOptions): string {
  return "video/mp4";
}
