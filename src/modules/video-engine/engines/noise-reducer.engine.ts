import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface NoiseReducerOptions { [key: string]: unknown; }
export async function buildNoiseReducerArgs(input: string, output: string, opts: NoiseReducerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const strength = (opts.strength as string) || "7";
  return ["-i", input, "-vf", `hqdn3d=${strength}`, "-c:a", "copy", output];
}
export function getNoiseReducerOutputName(opts: NoiseReducerOptions): string { return "output.mp4"; }
export function getNoiseReducerMimeType(opts: NoiseReducerOptions): string { return "video/mp4"; }