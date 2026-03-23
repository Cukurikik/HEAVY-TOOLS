import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface PitchShifterOptions { [key: string]: unknown; }
export async function buildPitchShifterArgs(input: string, output: string, opts: PitchShifterOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const semitones = (opts.semitones as number) ?? 0;
  const preserveTempo = opts.preserveTempo !== false;
  const rate = Math.pow(2, semitones / 12);
  if (preserveTempo) {
    // rubberband is not available in WASM, use asetrate + atempo to compensate
    const tempoFix = (1 / rate).toFixed(6);
    let atempoChain = "";
    let remaining = 1 / rate;
    while (remaining > 2.0) { atempoChain += "atempo=2.0,"; remaining /= 2.0; }
    while (remaining < 0.5) { atempoChain += "atempo=0.5,"; remaining *= 2.0; }
    atempoChain += `atempo=${remaining.toFixed(6)}`;
    return ["-i", input, "-af", `asetrate=44100*${rate.toFixed(6)},aresample=44100,${atempoChain}`, output];
  }
  return ["-i", input, "-af", `asetrate=44100*${rate.toFixed(6)},aresample=44100`, output];
}
export function getPitchShifterOutputName(opts: PitchShifterOptions): string { return "output.mp3"; }
export function getPitchShifterMimeType(opts: PitchShifterOptions): string { return "audio/mpeg"; }
