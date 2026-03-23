import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SpatialAudioOptions { [key: string]: unknown; }
export async function buildSpatialAudioArgs(input: string, output: string, opts: SpatialAudioOptions, ffmpeg?: FFmpeg): Promise<string[]> {
  const mode = (opts.mode as string) || "surround";
  const echoDepth = (opts.echoDepth as number) ?? 40;
  const width = (opts.width as number) ?? 1;
  if (mode === "surround") {
    return ["-i", input, "-af", `aecho=0.8:0.88:${echoDepth}:0.3,stereotools=mode=ms>lr:sbal=${width}`, output];
  } else if (mode === "mono") {
    return ["-i", input, "-af", "pan=mono|c0=0.5*c0+0.5*c1", output];
  }
  // Wide stereo
  return ["-i", input, "-af", `stereotools=mode=lr>lr:sbal=${width}:mlev=0.5`, output];
}
export function getSpatialAudioOutputName(opts: SpatialAudioOptions): string { return "output.mp3"; }
export function getSpatialAudioMimeType(opts: SpatialAudioOptions): string { return "audio/mpeg"; }
