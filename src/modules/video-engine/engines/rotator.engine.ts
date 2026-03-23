import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface RotatorOptions { [key: string]: unknown; }
export async function buildRotatorArgs(input: string, output: string, opts: RotatorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const deg = (opts.degrees as string) || "90";
  if (deg === "custom") {
    const angle = (opts.customAngle as number) || 0;
    const radians = (angle * Math.PI / 180).toFixed(4);
    return ["-i", input, "-vf", `rotate=${radians}:bilinear=1:fillcolor=black`, "-c:a", "copy", output];
  }
  let vf = "transpose=1";
  if (deg === "180") vf = "transpose=1,transpose=1";
  if (deg === "270") vf = "transpose=2";
  return ["-i", input, "-vf", vf, "-c:a", "copy", output];
}
export function getRotatorOutputName(opts: RotatorOptions): string { return "output.mp4"; }
export function getRotatorMimeType(opts: RotatorOptions): string { return "video/mp4"; }