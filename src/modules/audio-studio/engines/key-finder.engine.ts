import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface KeyFinderOptions { [key: string]: unknown; }
// Key Finder runs via Web Audio API in the store. This stub exists for dynamic dispatch compatibility.
export async function buildKeyFinderArgs(input: string, output: string, opts: KeyFinderOptions, ffmpeg?: FFmpeg): Promise<string[]> { return []; }
export function getKeyFinderOutputName(opts: KeyFinderOptions): string { return "output.wav"; }
export function getKeyFinderMimeType(opts: KeyFinderOptions): string { return "audio/wav"; }
