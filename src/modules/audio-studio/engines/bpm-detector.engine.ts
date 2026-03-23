import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BpmDetectorOptions { [key: string]: unknown; }
// BPM Detector runs via Web Audio API in the store. This stub exists for dynamic dispatch compatibility.
export async function buildBpmDetectorArgs(input: string, output: string, opts: BpmDetectorOptions, ffmpeg?: FFmpeg): Promise<string[]> { return []; }
export function getBpmDetectorOutputName(opts: BpmDetectorOptions): string { return "output.wav"; }
export function getBpmDetectorMimeType(opts: BpmDetectorOptions): string { return "audio/wav"; }
