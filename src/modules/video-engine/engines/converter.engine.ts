import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ConverterOptions { [key: string]: unknown; }
export async function buildConverterArgs(input: string, output: string, opts: ConverterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const format = (opts.format as string) || "mp4";
  const crf = (opts.crf as number) || 23;
  const resolution = (opts.resolution as string) || "original";
  const audioCodec = (opts.audioCodec as string) || "aac";
  const args: string[] = ["-i", input];
  if (format === "webm") {
    args.push("-c:v", "libvpx-vp9", "-crf", crf.toString(), "-b:v", "0");
  } else {
    args.push("-c:v", "libx264", "-crf", crf.toString(), "-preset", "fast");
  }
  if (resolution !== "original") {
    args.push("-vf", `scale=${resolution}`);
  }
  args.push("-c:a", audioCodec);
  args.push(output);
  return args;
}
export function getConverterOutputName(opts: ConverterOptions): string { return `output.${opts.format || 'mp4'}`; }
export function getConverterMimeType(opts: ConverterOptions): string {
  const f = opts.format as string || "mp4";
  return f === "webm" ? "video/webm" : f === "avi" ? "video/x-msvideo" : `video/${f}`;
}