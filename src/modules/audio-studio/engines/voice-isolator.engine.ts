import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface VoiceIsolatorOptions { [key: string]: unknown; }
export async function buildVoiceIsolatorArgs(input: string, output: string, opts: VoiceIsolatorOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const mode = (opts.mode as string) || "vocals";
  if (mode === "instruments") {
    // Extract side channels (instruments)
    return ["-i", input, "-af", "pan=stereo|c0=c0-c1|c1=c1-c0,volume=2", output];
  }
  // Extract center channel (vocals)
  return ["-i", input, "-af", "pan=mono|c0=0.5*c0+0.5*c1,volume=1.5", output];
}
export function getVoiceIsolatorOutputName(opts: VoiceIsolatorOptions): string { return "output.mp3"; }
export function getVoiceIsolatorMimeType(opts: VoiceIsolatorOptions): string { return "audio/mpeg"; }
