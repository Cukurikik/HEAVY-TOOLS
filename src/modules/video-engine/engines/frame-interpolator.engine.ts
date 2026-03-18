import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface FrameInterpolatorOptions {
  [key: string]: unknown;
}

/**
 * Frame Interpolator Engine
 * Tingkatkan FPS via minterpolate
 */
export function buildFrameInterpolatorArgs(
  input: string,
  output: string,
  opts: FrameInterpolatorOptions
): string[] {
  const fps = (opts.fps as number) || 60;
return ["-i", input, "-vf", `minterpolate=fps=${fps}:mi_mode=mci`, "-c:a", "copy", output];
}

export function getFrameInterpolatorOutputName(opts: FrameInterpolatorOptions): string {
  return "output.mp4";
}

export function getFrameInterpolatorMimeType(opts: FrameInterpolatorOptions): string {
  return "video/mp4";
}
