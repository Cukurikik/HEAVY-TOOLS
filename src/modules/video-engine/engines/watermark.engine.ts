import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface WatermarkOptions {
  [key: string]: unknown;
}

/**
 * Watermark Tool Engine
 * Tambah watermark teks
 */
export function buildWatermarkArgs(
  input: string,
  output: string,
  opts: WatermarkOptions
): string[] {
  const text = (opts.text as string) || "HEAVY-TOOLS";
const px = (opts.posX as string) || "10";
const py = (opts.posY as string) || "10";
const fs2 = (opts.fontSize as number) || 24;
const fc = (opts.fontColor as string) || "white";
return ["-i", input, "-vf", `drawtext=text='${text}':x=${px}:y=${py}:fontsize=${fs2}:fontcolor=${fc}:shadowcolor=black:shadowx=2:shadowy=2`, "-c:a", "copy", output];
}

export function getWatermarkOutputName(opts: WatermarkOptions): string {
  return "output.mp4";
}

export function getWatermarkMimeType(opts: WatermarkOptions): string {
  return "video/mp4";
}
