import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ReverseOptions { [key: string]: unknown; }
export async function buildReverseArgs(input: string, output: string, opts: ReverseOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const reverseAudio = opts.reverseAudio !== false;
  const args = ["-i", input, "-vf", "reverse"];
  if (reverseAudio) {
    // Reverse both video and audio
    args.push("-af", "areverse");
  } else {
    // BUG FIX: Old code used `-an` which REMOVES audio entirely.
    // Changed to `-c:a copy` to keep original (forward) audio track
    args.push("-c:a", "copy");
  }
  args.push(output);
  return args;
}
export function getReverseOutputName(opts: ReverseOptions): string { return "output.mp4"; }
export function getReverseMimeType(opts: ReverseOptions): string { return "video/mp4"; }