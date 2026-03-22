import fs from 'fs';
import path from 'path';

const enginesDir = 'src/modules/video-engine/engines';

const engines = {
  trimmer: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TrimmerOptions { [key: string]: unknown; }
export async function buildTrimmerArgs(input: string, output: string, opts: TrimmerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const start = (opts.start as string) || "00:00:00";
  const end = (opts.end as string) || "00:00:10";
  return ["-i", input, "-ss", start, "-to", end, "-c:v", "libx264", "-c:a", "aac", output];
}
export function getTrimmerOutputName(opts: TrimmerOptions): string { return "output.mp4"; }
export function getTrimmerMimeType(opts: TrimmerOptions): string { return "video/mp4"; }
`,
  merger: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
export interface MergerOptions { [key: string]: unknown; }
export async function buildMergerArgs(input: string, output: string, opts: MergerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg || !files) return [];
  let concatList = "";
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!f) continue;
    const ext = f.name.substring(f.name.lastIndexOf("."));
    const name = \`merge_\${i}\${ext}\`;
    await ffmpeg.writeFile(name, await fetchFile(f));
    concatList += \`file '\${name}'\\n\`;
  }
  await ffmpeg.writeFile("concat.txt", concatList);
  return ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", output];
}
export function getMergerOutputName(opts: MergerOptions): string { return "output.mp4"; }
export function getMergerMimeType(opts: MergerOptions): string { return "video/mp4"; }
`,
  converter: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ConverterOptions { [key: string]: unknown; }
export async function buildConverterArgs(input: string, output: string, opts: ConverterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const format = (opts.format as string) || "mp4";
  if (format === "webm") {
    return ["-i", input, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libvorbis", output];
  } else {
    return ["-i", input, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
  }
}
export function getConverterOutputName(opts: ConverterOptions): string { return \`output.\${opts.format || 'mp4'}\`; }
export function getConverterMimeType(opts: ConverterOptions): string { 
  const f = opts.format || "mp4";
  return f === "webm" ? "video/webm" : f === "avi" ? "video/x-msvideo" : \`video/\${f}\`;
}
`,
  compressor: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface CompressorOptions { [key: string]: unknown; }
export async function buildCompressorArgs(input: string, output: string, opts: CompressorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const crf = (opts.crf as number) || 28;
  const preset = (opts.preset as string) || "medium";
  return ["-i", input, "-c:v", "libx264", "-crf", crf.toString(), "-preset", preset, "-c:a", "aac", output];
}
export function getCompressorOutputName(opts: CompressorOptions): string { return "output.mp4"; }
export function getCompressorMimeType(opts: CompressorOptions): string { return "video/mp4"; }
`,
  flipper: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface FlipperOptions { [key: string]: unknown; }
export async function buildFlipperArgs(input: string, output: string, opts: FlipperOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const direction = (opts.direction as string) || "horizontal";
  const filter = direction === "vertical" ? "vflip" : "hflip";
  return ["-i", input, "-vf", filter, "-c:a", "copy", output];
}
export function getFlipperOutputName(opts: FlipperOptions): string { return "output.mp4"; }
export function getFlipperMimeType(opts: FlipperOptions): string { return "video/mp4"; }
`,
  rotator: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface RotatorOptions { [key: string]: unknown; }
export async function buildRotatorArgs(input: string, output: string, opts: RotatorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const deg = (opts.degrees as string) || "90";
  let vf = "transpose=1";
  if (deg === "180") vf = "transpose=1,transpose=1";
  if (deg === "270") vf = "transpose=2";
  return ["-i", input, "-vf", vf, "-c:a", "copy", output];
}
export function getRotatorOutputName(opts: RotatorOptions): string { return "output.mp4"; }
export function getRotatorMimeType(opts: RotatorOptions): string { return "video/mp4"; }
`,
  stabilizer: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface StabilizerOptions { [key: string]: unknown; }
export async function buildStabilizerArgs(input: string, output: string, opts: StabilizerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "deshake", "-c:a", "copy", output];
}
export function getStabilizerOutputName(opts: StabilizerOptions): string { return "output.mp4"; }
export function getStabilizerMimeType(opts: StabilizerOptions): string { return "video/mp4"; }
`,
  reverse: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ReverseOptions { [key: string]: unknown; }
export async function buildReverseArgs(input: string, output: string, opts: ReverseOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "reverse", "-af", "areverse", output];
}
export function getReverseOutputName(opts: ReverseOptions): string { return "output.mp4"; }
export function getReverseMimeType(opts: ReverseOptions): string { return "video/mp4"; }
`,
  "speed-control": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SpeedControlOptions { [key: string]: unknown; }
export async function buildSpeedControlArgs(input: string, output: string, opts: SpeedControlOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const speed = (opts.speed as number) || 1;
  const setpts = (1 / speed).toFixed(4);
  const atempo = Math.min(Math.max(speed, 0.5), 2.0);
  return ["-i", input, "-filter_complex", \`[0:v]setpts=\${setpts}*PTS[v];[0:a]atempo=\${atempo}[a]\`, "-map", "[v]", "-map", "[a]", output];
}
export function getSpeedControlOutputName(opts: SpeedControlOptions): string { return "output.mp4"; }
export function getSpeedControlMimeType(opts: SpeedControlOptions): string { return "video/mp4"; }
`,
  "loop-engine": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface LoopEngineOptions { [key: string]: unknown; }
export async function buildLoopEngineArgs(input: string, output: string, opts: LoopEngineOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const loops = (opts.loops as number) || 3;
  return ["-stream_loop", (loops - 1).toString(), "-i", input, "-c", "copy", output];
}
export function getLoopEngineOutputName(opts: LoopEngineOptions): string { return "output.mp4"; }
export function getLoopEngineMimeType(opts: LoopEngineOptions): string { return "video/mp4"; }
`,
  "pro-editor": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ProEditorOptions { [key: string]: unknown; }
export async function buildProEditorArgs(input: string, output: string, opts: ProEditorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const proCrf = (opts.crf as number) || 23;
  const codec = (opts.codec as string) || "libx264";
  const profile = (opts.profile as string) || "high";
  const proPreset = (opts.preset as string) || "medium";
  return ["-i", input, "-c:v", codec, "-crf", proCrf.toString(), "-profile:v", profile, "-preset", proPreset, "-c:a", "aac", output];
}
export function getProEditorOutputName(opts: ProEditorOptions): string { return "output.mp4"; }
export function getProEditorMimeType(opts: ProEditorOptions): string { return "video/mp4"; }
`,
  "thumbnail-extractor": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ThumbnailExtractorOptions { [key: string]: unknown; }
export async function buildThumbnailExtractorArgs(input: string, output: string, opts: ThumbnailExtractorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const timestamp = (opts.timestamp as string) || "00:00:01";
  return ["-i", input, "-ss", timestamp, "-frames:v", "1", "-q:v", "2", output];
}
export function getThumbnailExtractorOutputName(opts: ThumbnailExtractorOptions): string { return "thumbnail.png"; }
export function getThumbnailExtractorMimeType(opts: ThumbnailExtractorOptions): string { return "image/png"; }
`,
  "subtitle-burner": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SubtitleBurnerOptions { [key: string]: unknown; }
export async function buildSubtitleBurnerArgs(input: string, output: string, opts: SubtitleBurnerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if(!ffmpeg) return [];
  const subText = (opts.subtitleText as string) || "Sample Subtitle";
  const subStart = (opts.subStart as string) || "00:00:00,000";
  const subEnd = (opts.subEnd as string) || "00:00:10,000";
  const srtContent = \`1\\n\${subStart} --> \${subEnd}\\n\${subText}\`;
  await ffmpeg.writeFile("sub.srt", srtContent);
  return ["-i", input, "-vf", "subtitles=sub.srt", "-c:a", "copy", output];
}
export function getSubtitleBurnerOutputName(opts: SubtitleBurnerOptions): string { return "output.mp4"; }
export function getSubtitleBurnerMimeType(opts: SubtitleBurnerOptions): string { return "video/mp4"; }
`,
  watermark: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface WatermarkOptions { [key: string]: unknown; }
export async function buildWatermarkArgs(input: string, output: string, opts: WatermarkOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const text = (opts.text as string) || "HEAVY-TOOLS";
  const posX = (opts.posX as string) || "10";
  const posY = (opts.posY as string) || "10";
  const fontSize = (opts.fontSize as number) || 24;
  const fontColor = (opts.fontColor as string) || "white";
  return ["-i", input, "-vf", \`drawtext=text='\${text}':x=\${posX}:y=\${posY}:fontsize=\${fontSize}:fontcolor=\${fontColor}:shadowcolor=black:shadowx=2:shadowy=2\`, "-c:a", "copy", output];
}
export function getWatermarkOutputName(opts: WatermarkOptions): string { return "output.mp4"; }
export function getWatermarkMimeType(opts: WatermarkOptions): string { return "video/mp4"; }
`,
  "noise-reducer": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface NoiseReducerOptions { [key: string]: unknown; }
export async function buildNoiseReducerArgs(input: string, output: string, opts: NoiseReducerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const strength = (opts.strength as string) || "7";
  return ["-i", input, "-vf", \`hqdn3d=\${strength}\`, "-c:a", "copy", output];
}
export function getNoiseReducerOutputName(opts: NoiseReducerOptions): string { return "output.mp4"; }
export function getNoiseReducerMimeType(opts: NoiseReducerOptions): string { return "video/mp4"; }
`,
  "color-grader": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ColorGraderOptions { [key: string]: unknown; }
export async function buildColorGraderArgs(input: string, output: string, opts: ColorGraderOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const brightness = (opts.brightness as number) || 0;
  const contrast = (opts.contrast as number) || 1;
  const saturation = (opts.saturation as number) || 1;
  const hue = (opts.hue as number) || 0;
  return ["-i", input, "-vf", \`eq=brightness=\${brightness}:contrast=\${contrast}:saturation=\${saturation},hue=h=\${hue}\`, "-c:a", "copy", output];
}
export function getColorGraderOutputName(opts: ColorGraderOptions): string { return "output.mp4"; }
export function getColorGraderMimeType(opts: ColorGraderOptions): string { return "video/mp4"; }
`,
  "resolution-upscaler": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ResolutionUpscalerOptions { [key: string]: unknown; }
export async function buildResolutionUpscalerArgs(input: string, output: string, opts: ResolutionUpscalerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const scale = (opts.scale as number) || 2;
  return ["-i", input, "-vf", \`scale=iw*\${scale}:ih*\${scale}:flags=bicubic\`, "-c:a", "copy", output];
}
export function getResolutionUpscalerOutputName(opts: ResolutionUpscalerOptions): string { return "output.mp4"; }
export function getResolutionUpscalerMimeType(opts: ResolutionUpscalerOptions): string { return "video/mp4"; }
`,
  "frame-interpolator": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface FrameInterpolatorOptions { [key: string]: unknown; }
export async function buildFrameInterpolatorArgs(input: string, output: string, opts: FrameInterpolatorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const targetFps = (opts.fps as number) || 60;
  return ["-i", input, "-vf", \`minterpolate=fps=\${targetFps}:mi_mode=mci\`, "-c:a", "copy", output];
}
export function getFrameInterpolatorOutputName(opts: FrameInterpolatorOptions): string { return "output.mp4"; }
export function getFrameInterpolatorMimeType(opts: FrameInterpolatorOptions): string { return "video/mp4"; }
`,
  "gif-converter": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface GifConverterOptions { [key: string]: unknown; }
export async function buildGifConverterArgs(input: string, output: string, opts: GifConverterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const gifFps = (opts.fps as number) || 10;
  const gifScale = (opts.scale as number) || 480;
  return ["-i", input, "-vf", \`fps=\${gifFps},scale=\${gifScale}:-1:flags=lanczos\`, output];
}
export function getGifConverterOutputName(opts: GifConverterOptions): string { return "output.gif"; }
export function getGifConverterMimeType(opts: GifConverterOptions): string { return "image/gif"; }
`,
  "hdr-tonemapper": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface HdrTonemapperOptions { [key: string]: unknown; }
export async function buildHdrTonemapperArgs(input: string, output: string, opts: HdrTonemapperOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p", "-c:a", "copy", output];
}
export function getHdrTonemapperOutputName(opts: HdrTonemapperOptions): string { return "output.mp4"; }
export function getHdrTonemapperMimeType(opts: HdrTonemapperOptions): string { return "video/mp4"; }
`,
  "black-white": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BlackWhiteOptions { [key: string]: unknown; }
export async function buildBlackWhiteArgs(input: string, output: string, opts: BlackWhiteOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
}
export function getBlackWhiteOutputName(opts: BlackWhiteOptions): string { return "output.mp4"; }
export function getBlackWhiteMimeType(opts: BlackWhiteOptions): string { return "video/mp4"; }
`,
  "slow-motion": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface SlowMotionOptions { [key: string]: unknown; }
export async function buildSlowMotionArgs(input: string, output: string, opts: SlowMotionOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const slowFactor = (opts.factor as number) || 0.5;
  const slowPts = (1 / slowFactor).toFixed(4);
  return ["-i", input, "-vf", \`setpts=\${slowPts}*PTS,minterpolate=fps=30:mi_mode=mci\`, "-an", output];
}
export function getSlowMotionOutputName(opts: SlowMotionOptions): string { return "output.mp4"; }
export function getSlowMotionMimeType(opts: SlowMotionOptions): string { return "video/mp4"; }
`,
  timelapse: `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface TimelapseOptions { [key: string]: unknown; }
export async function buildTimelapseArgs(input: string, output: string, opts: TimelapseOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const tlSpeed = (opts.speed as number) || 10;
  const tlStep = Math.max(1, Math.round(tlSpeed));
  return ["-i", input, "-vf", \`framestep=\${tlStep},setpts=N/30/TB\`, "-an", output];
}
export function getTimelapseOutputName(opts: TimelapseOptions): string { return "output.mp4"; }
export function getTimelapseMimeType(opts: TimelapseOptions): string { return "video/mp4"; }
`,
  "screen-recorder": `
// Screen recorder uses MediaRecorder API, not FFmpeg.
`,
  "metadata-editor": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface MetadataEditorOptions { [key: string]: unknown; }
export async function buildMetadataEditorArgs(input: string, output: string, opts: MetadataEditorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const title = (opts.title as string) || "";
  const author = (opts.author as string) || "";
  const copyright = (opts.copyright as string) || "";
  const metaArgs: string[] = ["-i", input];
  if (title) metaArgs.push("-metadata", \`title=\${title}\`);
  if (author) metaArgs.push("-metadata", \`artist=\${author}\`);
  if (copyright) metaArgs.push("-metadata", \`copyright=\${copyright}\`);
  metaArgs.push("-c", "copy", output);
  return metaArgs;
}
export function getMetadataEditorOutputName(opts: MetadataEditorOptions): string { return "output.mp4"; }
export function getMetadataEditorMimeType(opts: MetadataEditorOptions): string { return "video/mp4"; }
`,
  "batch-processor": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface BatchProcessorOptions { [key: string]: unknown; }
export async function buildBatchProcessorArgs(input: string, output: string, opts: BatchProcessorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  // Return the base arguments for a single file. The store loops through files.
  const batchOp = (opts.batchOperation as string) || "compress";
  const batchCrf = (opts.batchCrf as number) || 28;
  if (batchOp === "compress") {
    return ["-i", input, "-c:v", "libx264", "-crf", batchCrf.toString(), "-preset", "fast", "-c:a", "aac", output];
  } else if (batchOp === "grayscale") {
    return ["-i", input, "-vf", "hue=s=0", "-c:a", "copy", output];
  } else {
    return ["-i", input, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
  }
}
export function getBatchProcessorOutputName(opts: BatchProcessorOptions): string { return "output.mp4"; }
export function getBatchProcessorMimeType(opts: BatchProcessorOptions): string { return "video/mp4"; }
`,
  "chapter-marker": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ChapterMarkerOptions { [key: string]: unknown; }
export async function buildChapterMarkerArgs(input: string, output: string, opts: ChapterMarkerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg) return [];
  const chapters = (opts.chapters as string) || "00:00:00=Intro\\n00:01:00=Chapter 1";
  const metadataLines = [";FFMETADATA1"];
  const chapterLines = chapters.split("\\n").filter((l: string) => l.trim());
  for (let i = 0; i < chapterLines.length; i++) {
    const [time, chTitle] = chapterLines[i].split("=");
    const parts = time.trim().split(":");
    const secs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    const startMs = secs * 1000;
    const endMs = i < chapterLines.length - 1
      ? (() => {
          const [nt] = chapterLines[i + 1].split("=");
          const np = nt.trim().split(":");
          return (parseInt(np[0]) * 3600 + parseInt(np[1]) * 60 + parseInt(np[2])) * 1000;
        })()
      : startMs + 60000;
    metadataLines.push("[CHAPTER]", "TIMEBASE=1/1000", \`START=\${startMs}\`, \`END=\${endMs}\`, \`title=\${(chTitle || "Chapter").trim()}\`);
  }
  await ffmpeg.writeFile("metadata.txt", metadataLines.join("\\n"));
  return ["-i", input, "-i", "metadata.txt", "-map_metadata", "1", "-c", "copy", output];
}
export function getChapterMarkerOutputName(opts: ChapterMarkerOptions): string { return "output.mp4"; }
export function getChapterMarkerMimeType(opts: ChapterMarkerOptions): string { return "video/mp4"; }
`,
  "audio-extractor": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AudioExtractorOptions { [key: string]: unknown; }
export async function buildAudioExtractorArgs(input: string, output: string, opts: AudioExtractorOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const audioFmt = (opts.format as string) || "mp3";
  if (audioFmt === "mp3") {
    return ["-i", input, "-vn", "-acodec", "libmp3lame", "-q:a", "2", output];
  } else if (audioFmt === "wav") {
    return ["-i", input, "-vn", "-acodec", "pcm_s16le", output];
  } else {
    return ["-i", input, "-vn", "-c:a", "aac", output];
  }
}
export function getAudioExtractorOutputName(opts: AudioExtractorOptions): string { return \`output.\${opts.format || 'mp3'}\`; }
export function getAudioExtractorMimeType(opts: AudioExtractorOptions): string { 
  const audioFmt = opts.format || "mp3";
  return audioFmt === "mp3" ? "audio/mpeg" : audioFmt === "wav" ? "audio/wav" : audioFmt === "aac" ? "audio/aac" : \`audio/\${audioFmt}\`;
}
`,
  "video-splitter": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface VideoSplitterOptions { [key: string]: unknown; }
export async function buildVideoSplitterArgs(input: string, output: string, opts: VideoSplitterOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const segDuration = (opts.segmentDuration as number) || 30;
  return ["-i", input, "-c", "copy", "-f", "segment", "-segment_time", segDuration.toString(), "-reset_timestamps", "1", output];
}
export function getVideoSplitterOutputName(opts: VideoSplitterOptions): string { return "segment_%03d.mp4"; }
export function getVideoSplitterMimeType(opts: VideoSplitterOptions): string { return "video/mp4"; }
`,
  "aspect-ratio": `
import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface AspectRatioOptions { [key: string]: unknown; }
export async function buildAspectRatioArgs(input: string, output: string, opts: AspectRatioOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  const ratio = (opts.ratio as string) || "16:9";
  const mode = (opts.mode as string) || "crop";
  if (mode === "crop") {
    if (ratio === "16:9") return ["-i", input, "-vf", "crop=iw:iw*9/16", "-c:a", "copy", output];
    else if (ratio === "4:3") return ["-i", input, "-vf", "crop=ih*4/3:ih", "-c:a", "copy", output];
    else if (ratio === "1:1") return ["-i", input, "-vf", "crop=min(iw\\\\,ih):min(iw\\\\,ih)", "-c:a", "copy", output];
    else if (ratio === "9:16") return ["-i", input, "-vf", "crop=ih*9/16:ih", "-c:a", "copy", output];
    else return ["-i", input, "-vf", "crop=iw:iw*9/16", "-c:a", "copy", output];
  } else {
    if (ratio === "16:9") return ["-i", input, "-vf", "pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else if (ratio === "4:3") return ["-i", input, "-vf", "pad=ih*4/3:ih:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else if (ratio === "1:1") return ["-i", input, "-vf", "pad=max(iw\\\\,ih):max(iw\\\\,ih):(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else if (ratio === "9:16") return ["-i", input, "-vf", "pad=ih*9/16:ih:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
    else return ["-i", input, "-vf", "pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", output];
  }
}
export function getAspectRatioOutputName(opts: AspectRatioOptions): string { return "output.mp4"; }
export function getAspectRatioMimeType(opts: AspectRatioOptions): string { return "video/mp4"; }
`
};

for (const [tool, content] of Object.entries(engines)) {
  fs.writeFileSync(path.join(enginesDir, `${tool}.engine.ts`), content.trim());
}

console.log('Successfully wrote 30 engine files!');
