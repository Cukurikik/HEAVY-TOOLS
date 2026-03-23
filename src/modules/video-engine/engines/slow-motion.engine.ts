import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SlowMotionOptions { [key: string]: unknown; }
export async function buildSlowMotionArgs(input: string, output: string, opts: SlowMotionOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const slowFactor = (opts.factor as number) || 0.5;
  const interpolate = opts.interpolate !== false;
  const keepAudio = opts.keepAudio === true;
  const slowPts = (1 / slowFactor).toFixed(4);
  let vf = `setpts=${slowPts}*PTS`;
  if (interpolate) vf += `,minterpolate=fps=30:mi_mode=mci`;
  const args = ["-i", input, "-vf", vf];
  if (keepAudio) {
    const atempo = Math.max(0.5, slowFactor);
    args.push("-af", `atempo=${atempo.toFixed(4)}`);
  } else {
    args.push("-an");
  }
  args.push(output);
  return args;
}
export function getSlowMotionOutputName(opts: SlowMotionOptions): string { return "output.mp4"; }
export function getSlowMotionMimeType(opts: SlowMotionOptions): string { return "video/mp4"; }