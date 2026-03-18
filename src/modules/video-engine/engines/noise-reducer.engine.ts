import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface NoiseReducerOptions {
  [key: string]: unknown;
}

/**
 * Noise Reducer Engine
 * Kurangi noise visual via hqdn3d
 */
export function buildNoiseReducerArgs(
  input: string,
  output: string,
  opts: NoiseReducerOptions
): string[] {
  const str = (opts.strength as string) || "7";
return ["-i", input, "-vf", `hqdn3d=${str}`, "-c:a", "copy", output];
}

export function getNoiseReducerOutputName(opts: NoiseReducerOptions): string {
  return "output.mp4";
}

export function getNoiseReducerMimeType(opts: NoiseReducerOptions): string {
  return "video/mp4";
}
