import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SilenceRemoverOptions { [key: string]: unknown; }
export async function buildSilenceRemoverArgs(input: string, output: string, opts: SilenceRemoverOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const threshold = (opts.threshold as number) ?? -40;
  const minDuration = (opts.minDuration as number) ?? 0.5;
  return ["-i", input, "-af", `silenceremove=start_periods=1:start_duration=${minDuration}:start_threshold=${threshold}dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_duration=${minDuration}:start_threshold=${threshold}dB:detection=peak,aformat=dblp,areverse`, output];
}
export function getSilenceRemoverOutputName(opts: SilenceRemoverOptions): string { return "output.mp3"; }
export function getSilenceRemoverMimeType(opts: SilenceRemoverOptions): string { return "audio/mpeg"; }
