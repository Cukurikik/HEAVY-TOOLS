import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TimeStretchOptions { [key: string]: unknown; }
export async function buildTimeStretchArgs(input: string, output: string, opts: TimeStretchOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const tempo = (opts.tempo as number) ?? 1.0;
  // Chain atempo filters for values outside 0.5-2.0 range
  let atempoChain = "";
  let remaining = tempo;
  while (remaining > 2.0) { atempoChain += "atempo=2.0,"; remaining /= 2.0; }
  while (remaining < 0.5) { atempoChain += "atempo=0.5,"; remaining *= 2.0; }
  atempoChain += `atempo=${remaining.toFixed(6)}`;
  return ["-i", input, "-af", atempoChain, output];
}
export function getTimeStretchOutputName(opts: TimeStretchOptions): string { return "output.mp3"; }
export function getTimeStretchMimeType(opts: TimeStretchOptions): string { return "audio/mpeg"; }
