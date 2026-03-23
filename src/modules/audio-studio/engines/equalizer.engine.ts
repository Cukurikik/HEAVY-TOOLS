import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface EqualizerOptions { [key: string]: unknown; }
export async function buildEqualizerArgs(input: string, output: string, opts: EqualizerOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const sub = (opts.sub as number) ?? 0;
  const bass = (opts.bass as number) ?? 0;
  const mid = (opts.mid as number) ?? 0;
  const presence = (opts.presence as number) ?? 0;
  const treble = (opts.treble as number) ?? 0;
  const filters: string[] = [];
  if (sub !== 0) filters.push(`equalizer=f=60:t=h:width=80:g=${sub}`);
  if (bass !== 0) filters.push(`equalizer=f=200:t=h:width=200:g=${bass}`);
  if (mid !== 0) filters.push(`equalizer=f=1000:t=h:width=500:g=${mid}`);
  if (presence !== 0) filters.push(`equalizer=f=4000:t=h:width=2000:g=${presence}`);
  if (treble !== 0) filters.push(`equalizer=f=10000:t=h:width=3000:g=${treble}`);
  const af = filters.length > 0 ? filters.join(",") : "anull";
  return ["-i", input, "-af", af, output];
}
export function getEqualizerOutputName(opts: EqualizerOptions): string { return "output.mp3"; }
export function getEqualizerMimeType(opts: EqualizerOptions): string { return "audio/mpeg"; }
