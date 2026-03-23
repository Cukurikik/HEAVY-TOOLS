import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface CompressorOptions { [key: string]: unknown; }
export async function buildCompressorArgs(input: string, output: string, opts: CompressorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const crf = (opts.crf as number) || 28;
  const preset = (opts.preset as string) || "medium";
  const bitrate = opts.bitrate as number | undefined;
  const audioBitrate = (opts.audioBitrate as string) || "128";
  const args = ["-i", input, "-c:v", "libx264"];
  if (bitrate) {
    args.push("-b:v", `${bitrate}k`);
  } else {
    args.push("-crf", crf.toString());
  }
  args.push("-preset", preset, "-c:a", "aac", "-b:a", `${audioBitrate}k`, output);
  return args;
}
export function getCompressorOutputName(opts: CompressorOptions): string { return "output.mp4"; }
export function getCompressorMimeType(opts: CompressorOptions): string { return "video/mp4"; }