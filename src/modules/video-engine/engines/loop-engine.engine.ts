import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface LoopEngineOptions { [key: string]: unknown; }
export async function buildLoopEngineArgs(input: string, output: string, opts: LoopEngineOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const loops = (opts.loops as number) || 3;
  return ["-stream_loop", (loops - 1).toString(), "-i", input, "-c", "copy", output];
}
export function getLoopEngineOutputName(opts: LoopEngineOptions): string { return "output.mp4"; }
export function getLoopEngineMimeType(opts: LoopEngineOptions): string { return "video/mp4"; }