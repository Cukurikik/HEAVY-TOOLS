import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ReverbOptions { [key: string]: unknown; }
export async function buildReverbArgs(input: string, output: string, opts: ReverbOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const roomSize = (opts.roomSize as number) ?? 60;
  const dampening = (opts.dampening as number) ?? 0.4;
  const wetDry = (opts.wetDry as number) ?? 0.6;
  return ["-i", input, "-af", `aecho=${wetDry}:${wetDry}:${roomSize}:${dampening}`, output];
}
export function getReverbOutputName(opts: ReverbOptions): string { return "output.mp3"; }
export function getReverbMimeType(opts: ReverbOptions): string { return "audio/mpeg"; }
