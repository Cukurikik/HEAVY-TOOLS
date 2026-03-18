import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface SpeedControlOptions {
  [key: string]: unknown;
}

/**
 * Speed Controller Engine
 * Ubah kecepatan 0.25x–4x
 */
export function buildSpeedControlArgs(
  input: string,
  output: string,
  opts: SpeedControlOptions
): string[] {
  const speed = (opts.speed as number) || 1;
const setpts = (1/speed).toFixed(4);
const atempo = Math.min(Math.max(speed,0.5),2.0);
return ["-i", input, "-filter_complex", `[0:v]setpts=${setpts}*PTS[v];[0:a]atempo=${atempo}[a]`, "-map", "[v]", "-map", "[a]", output];
}

export function getSpeedControlOutputName(opts: SpeedControlOptions): string {
  return "output.mp4";
}

export function getSpeedControlMimeType(opts: SpeedControlOptions): string {
  return "video/mp4";
}
