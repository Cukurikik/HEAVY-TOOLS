import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface RotatorOptions {
  [key: string]: unknown;
}

/**
 * Video Rotator Engine
 * Rotasi 90°/180°/270°
 */
export function buildRotatorArgs(
  input: string,
  output: string,
  opts: RotatorOptions
): string[] {
  const deg = (opts.degrees as string) || "90";
let vf = "transpose=1";
if (deg === "180") vf = "transpose=1,transpose=1";
if (deg === "270") vf = "transpose=2";
return ["-i", input, "-vf", vf, "-c:a", "copy", output];
}

export function getRotatorOutputName(opts: RotatorOptions): string {
  return "output.mp4";
}

export function getRotatorMimeType(opts: RotatorOptions): string {
  return "video/mp4";
}
