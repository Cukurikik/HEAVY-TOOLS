import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TimelapseOptions { [key: string]: unknown; }
export async function buildTimelapseArgs(input: string, output: string, opts: TimelapseOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const tlSpeed = (opts.speed as number) || 10;
  const outputFps = (opts.outputFps as number) || 30;
  const tlStep = Math.max(1, Math.round(tlSpeed));
  return ["-i", input, "-vf", `framestep=${tlStep},setpts=N/${outputFps}/TB`, "-r", outputFps.toString(), "-an", output];
}
export function getTimelapseOutputName(opts: TimelapseOptions): string { return "output.mp4"; }
export function getTimelapseMimeType(opts: TimelapseOptions): string { return "video/mp4"; }