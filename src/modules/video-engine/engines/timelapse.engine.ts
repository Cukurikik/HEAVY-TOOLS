import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface TimelapseOptions {
  [key: string]: unknown;
}

/**
 * Timelapse Maker Engine
 * Buat timelapse skip-frame
 */
export function buildTimelapseArgs(
  input: string,
  output: string,
  opts: TimelapseOptions
): string[] {
  const sp = (opts.speed as number) || 10;
const pts = (1/sp).toFixed(4);
return ["-i", input, "-vf", `setpts=${pts}*PTS`, "-an", output];
}

export function getTimelapseOutputName(opts: TimelapseOptions): string {
  return "output.mp4";
}

export function getTimelapseMimeType(opts: TimelapseOptions): string {
  return "video/mp4";
}
