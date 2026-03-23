import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface FrameInterpolatorOptions { [key: string]: unknown; }
export async function buildFrameInterpolatorArgs(input: string, output: string, opts: FrameInterpolatorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const targetFps = (opts.fps as number) || 60;
  const meMode = (opts.meMode as string) || "mci";
  return ["-i", input, "-vf", `minterpolate=fps=${targetFps}:mi_mode=${meMode}`, "-c:a", "copy", output];
}
export function getFrameInterpolatorOutputName(opts: FrameInterpolatorOptions): string { return "output.mp4"; }
export function getFrameInterpolatorMimeType(opts: FrameInterpolatorOptions): string { return "video/mp4"; }