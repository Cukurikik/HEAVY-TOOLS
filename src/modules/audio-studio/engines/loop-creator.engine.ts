import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface LoopCreatorOptions { [key: string]: unknown; }
export async function buildLoopCreatorArgs(input: string, output: string, opts: LoopCreatorOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const loops = (opts.loops as number) ?? 3;
  return ["-stream_loop", (loops - 1).toString(), "-i", input, "-c", "copy", output];
}
export function getLoopCreatorOutputName(opts: LoopCreatorOptions): string { return "output.mp3"; }
export function getLoopCreatorMimeType(opts: LoopCreatorOptions): string { return "audio/mpeg"; }
