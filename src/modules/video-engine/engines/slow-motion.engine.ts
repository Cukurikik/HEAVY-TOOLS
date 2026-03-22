import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SlowMotionOptions { [key: string]: unknown; }
export async function buildSlowMotionArgs(input: string, output: string, opts: SlowMotionOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const slowFactor = (opts.factor as number) || 0.5;
  const slowPts = (1 / slowFactor).toFixed(4);
  return ["-i", input, "-vf", `setpts=${slowPts}*PTS,minterpolate=fps=30:mi_mode=mci`, "-an", output];
}
export function getSlowMotionOutputName(opts: SlowMotionOptions): string { return "output.mp4"; }
export function getSlowMotionMimeType(opts: SlowMotionOptions): string { return "video/mp4"; }