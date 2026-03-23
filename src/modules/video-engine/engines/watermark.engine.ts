import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface WatermarkOptions { [key: string]: unknown; }
export async function buildWatermarkArgs(input: string, output: string, opts: WatermarkOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const text = (opts.text as string) || "HEAVY-TOOLS";
  const position = (opts.position as string) || "bottom-right";
  const fontSize = (opts.fontSize as number) || 24;
  const fontColor = (opts.fontColor as string) || "white";
  const opacity = (opts.opacity as number) ?? 0.7;
  const alpha = opacity.toFixed(2);

  let posX = "10", posY = "10";
  if (position === "top-right") { posX = "w-tw-10"; posY = "10"; }
  else if (position === "center") { posX = "(w-tw)/2"; posY = "(h-th)/2"; }
  else if (position === "bottom-left") { posX = "10"; posY = "h-th-10"; }
  else if (position === "bottom-right") { posX = "w-tw-10"; posY = "h-th-10"; }

  return ["-i", input, "-vf", `drawtext=text='${text}':x=${posX}:y=${posY}:fontsize=${fontSize}:fontcolor=${fontColor}@${alpha}:shadowcolor=black@0.5:shadowx=2:shadowy=2`, "-c:a", "copy", output];
}
export function getWatermarkOutputName(opts: WatermarkOptions): string { return "output.mp4"; }
export function getWatermarkMimeType(opts: WatermarkOptions): string { return "video/mp4"; }