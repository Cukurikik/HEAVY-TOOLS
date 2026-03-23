import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SpeedControlOptions { [key: string]: unknown; }
export async function buildSpeedControlArgs(input: string, output: string, opts: SpeedControlOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const speed = (opts.speed as number) || 1;
  const keepAudio = opts.keepAudio !== false;
  const setpts = (1 / speed).toFixed(4);

  if (!keepAudio) {
    return ["-i", input, "-vf", `setpts=${setpts}*PTS`, "-an", output];
  }

  // Chain atempo filters for extreme speeds (atempo supports 0.5-2.0 range)
  let atempoChain = "";
  let remaining = speed;
  while (remaining > 2.0) {
    atempoChain += "atempo=2.0,";
    remaining /= 2.0;
  }
  while (remaining < 0.5) {
    atempoChain += "atempo=0.5,";
    remaining /= 0.5;
  }
  atempoChain += `atempo=${remaining.toFixed(4)}`;

  return ["-i", input, "-filter_complex", `[0:v]setpts=${setpts}*PTS[v];[0:a]${atempoChain}[a]`, "-map", "[v]", "-map", "[a]", output];
}
export function getSpeedControlOutputName(opts: SpeedControlOptions): string { return "output.mp4"; }
export function getSpeedControlMimeType(opts: SpeedControlOptions): string { return "video/mp4"; }