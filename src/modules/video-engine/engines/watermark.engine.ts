import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface WatermarkOptions { [key: string]: unknown; }
export async function buildWatermarkArgs(input: string, output: string, opts: WatermarkOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const text = (opts.text as string) || "HEAVY-TOOLS";
  const posX = (opts.posX as string) || "10";
  const posY = (opts.posY as string) || "10";
  const fontSize = (opts.fontSize as number) || 24;
  const fontColor = (opts.fontColor as string) || "white";
  return ["-i", input, "-vf", `drawtext=text='${text}':x=${posX}:y=${posY}:fontsize=${fontSize}:fontcolor=${fontColor}:shadowcolor=black:shadowx=2:shadowy=2`, "-c:a", "copy", output];
}
export function getWatermarkOutputName(opts: WatermarkOptions): string { return "output.mp4"; }
export function getWatermarkMimeType(opts: WatermarkOptions): string { return "video/mp4"; }