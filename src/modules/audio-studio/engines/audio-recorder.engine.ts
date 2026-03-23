import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AudioRecorderOptions { [key: string]: unknown; }
// Audio Recorder runs via MediaRecorder API in the store. This stub exists for dynamic dispatch compatibility.
export async function buildAudioRecorderArgs(input: string, output: string, opts: AudioRecorderOptions, ffmpeg?: FFmpeg): Promise<string[]> { return []; }
export function getAudioRecorderOutputName(opts: AudioRecorderOptions): string { return "output.webm"; }
export function getAudioRecorderMimeType(opts: AudioRecorderOptions): string { return "audio/webm"; }
