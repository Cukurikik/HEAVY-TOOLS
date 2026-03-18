import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface ColorGraderOptions {
  [key: string]: unknown;
}

/**
 * Color Grader Engine
 * Brightness, contrast, saturation, hue
 */
export function buildColorGraderArgs(
  input: string,
  output: string,
  opts: ColorGraderOptions
): string[] {
  const b = (opts.brightness as number) || 0;
const c = (opts.contrast as number) || 1;
const s = (opts.saturation as number) || 1;
const h = (opts.hue as number) || 0;
return ["-i", input, "-vf", `eq=brightness=${b}:contrast=${c}:saturation=${s},hue=h=${h}`, "-c:a", "copy", output];
}

export function getColorGraderOutputName(opts: ColorGraderOptions): string {
  return "output.mp4";
}

export function getColorGraderMimeType(opts: ColorGraderOptions): string {
  return "video/mp4";
}
