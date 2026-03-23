import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface FadeEditorOptions { [key: string]: unknown; }
export async function buildFadeEditorArgs(input: string, output: string, opts: FadeEditorOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const fadeIn = (opts.fadeIn as number) ?? 2;
  const fadeOut = (opts.fadeOut as number) ?? 3;
  const curveIn = (opts.curveIn as string) || "tri";
  const curveOut = (opts.curveOut as string) || "tri";
  // Fade out start time: use a large number and let FFmpeg handle the actual duration
  return ["-i", input, "-af", `afade=t=in:st=0:d=${fadeIn}:curve=${curveIn},afade=t=out:st=99999:d=${fadeOut}:curve=${curveOut}`, output];
}
export function getFadeEditorOutputName(opts: FadeEditorOptions): string { return "output.mp3"; }
export function getFadeEditorMimeType(opts: FadeEditorOptions): string { return "audio/mpeg"; }
