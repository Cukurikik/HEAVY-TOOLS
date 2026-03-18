import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface SlowMotionOptions {
  [key: string]: unknown;
}

/**
 * Slow Motion Engine
 * Slow motion hingga 0.1x
 */
export function buildSlowMotionArgs(
  input: string,
  output: string,
  opts: SlowMotionOptions
): string[] {
  const f = (opts.factor as number) || 0.5;
const pts = (1/f).toFixed(4);
return ["-i", input, "-vf", `setpts=${pts}*PTS`, "-an", output];
}

export function getSlowMotionOutputName(opts: SlowMotionOptions): string {
  return "output.mp4";
}

export function getSlowMotionMimeType(opts: SlowMotionOptions): string {
  return "video/mp4";
}
