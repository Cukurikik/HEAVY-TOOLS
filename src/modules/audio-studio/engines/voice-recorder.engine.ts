import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface VoiceRecorderOptions { [key: string]: unknown; }
// Voice Recorder runs via MediaRecorder API in the store. This stub exists for dynamic dispatch compatibility.
export async function buildVoiceRecorderArgs(input: string, output: string, opts: VoiceRecorderOptions, ffmpeg?: FFmpeg): Promise<string[]> { return []; }
export function getVoiceRecorderOutputName(opts: VoiceRecorderOptions): string { return "output.webm"; }
export function getVoiceRecorderMimeType(opts: VoiceRecorderOptions): string { return "audio/webm"; }
