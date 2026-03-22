import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ScreenRecorderOptions { [key: string]: unknown; }
export async function buildScreenRecorderArgs(input: string, output: string, opts: ScreenRecorderOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return []; // Uses MediaRecorder
}
export function getScreenRecorderOutputName(opts: ScreenRecorderOptions): string { return "output.webm"; }
export function getScreenRecorderMimeType(opts: ScreenRecorderOptions): string { return "video/webm"; }