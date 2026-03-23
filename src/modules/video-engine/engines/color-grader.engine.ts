import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ColorGraderOptions { [key: string]: unknown; }
export async function buildColorGraderArgs(input: string, output: string, opts: ColorGraderOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const brightness = (opts.brightness as number) ?? 0;
  const contrast = (opts.contrast as number) ?? 1;
  const saturation = (opts.saturation as number) ?? 1;
  const hue = (opts.hue as number) ?? 0;
  const gamma = (opts.gamma as number) ?? 1;
  return ["-i", input, "-vf", `eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}:gamma=${gamma},hue=h=${hue}`, "-c:a", "copy", output];
}
export function getColorGraderOutputName(opts: ColorGraderOptions): string { return "output.mp4"; }
export function getColorGraderMimeType(opts: ColorGraderOptions): string { return "video/mp4"; }