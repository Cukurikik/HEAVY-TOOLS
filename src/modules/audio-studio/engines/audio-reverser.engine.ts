import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AudioReverserOptions { [key: string]: unknown; }
export async function buildAudioReverserArgs(input: string, output: string, opts: AudioReverserOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  return ["-i", input, "-af", "areverse", output];
}
export function getAudioReverserOutputName(opts: AudioReverserOptions): string { return "output.mp3"; }
export function getAudioReverserMimeType(opts: AudioReverserOptions): string { return "audio/mpeg"; }
