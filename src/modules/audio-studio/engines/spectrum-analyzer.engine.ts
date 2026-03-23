import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SpectrumAnalyzerOptions { [key: string]: unknown; }
// Spectrum Analyzer runs via Web Audio API in the store. This stub exists for dynamic dispatch compatibility.
export async function buildSpectrumAnalyzerArgs(input: string, output: string, opts: SpectrumAnalyzerOptions, ffmpeg?: FFmpeg): Promise<string[]> { return []; }
export function getSpectrumAnalyzerOutputName(opts: SpectrumAnalyzerOptions): string { return "output.wav"; }
export function getSpectrumAnalyzerMimeType(opts: SpectrumAnalyzerOptions): string { return "audio/wav"; }
