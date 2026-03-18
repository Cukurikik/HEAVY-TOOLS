import type { FFmpeg } from "@ffmpeg/ffmpeg";

export interface LoopEngineOptions {
  [key: string]: unknown;
}

/**
 * Loop Engine Engine
 * Buat video loop kustom
 */
export function buildLoopEngineArgs(
  input: string,
  output: string,
  opts: LoopEngineOptions
): string[] {
  const loops = (opts.loops as number) || 3;
return ["-stream_loop", (loops-1).toString(), "-i", input, "-c", "copy", output];
}

export function getLoopEngineOutputName(opts: LoopEngineOptions): string {
  return "output.mp4";
}

export function getLoopEngineMimeType(opts: LoopEngineOptions): string {
  return "video/mp4";
}
