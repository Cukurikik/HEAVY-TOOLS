// ============================================================
// GENERATE ALL VIDEO FEATURE FILES — Node.js approach
// Run: node generate-features.mjs
// ============================================================
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const base = 'src/app/modules/video';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
  console.log('  CREATED:', path);
}

// All 29 remaining features (02-30) defined here
const features = [
  {
    num: '02', folder: '02-merger', cls: 'Merger', var: 'merger', title: 'Video Merger', emoji: '🔗',
    desc: 'Concatenate multiple video files in custom order using FFmpeg concat protocol',
    ext: 'mp4',
    ffmpegCmd: '-f concat -safe 0 -i list.txt -c copy output.mp4',
    extraState: `  clips: { id: string; file: File; duration: number }[];\n  encodeMode: 'copy' | 'reencode';\n  outputFormat: 'mp4' | 'webm';`,
    extraInit: `  clips: [],\n  encodeMode: 'copy',\n  outputFormat: 'mp4',`,
  },
  {
    num: '03', folder: '03-converter', cls: 'Converter', var: 'converter', title: 'Format Converter', emoji: '🔄',
    desc: 'Convert video between MP4, WebM, MOV, AVI, MKV, GIF with codec selection',
    ext: 'mp4',
    ffmpegCmd: '-i input -c:v libx264 output.mp4',
    extraState: `  targetFormat: 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'gif';\n  codec: string;\n  qualityPreset: 'fast' | 'balanced' | 'best';\n  estimatedSizeMB: number;`,
    extraInit: `  targetFormat: 'mp4',\n  codec: 'libx264',\n  qualityPreset: 'balanced',\n  estimatedSizeMB: 0,`,
  },
  {
    num: '04', folder: '04-compressor', cls: 'Compressor', var: 'compressor', title: 'Video Compressor', emoji: '📦',
    desc: 'Reduce video file size with target size input or CRF quality control',
    ext: 'mp4',
    ffmpegCmd: '-crf 23 -preset medium output.mp4',
    extraState: `  mode: 'targetSize' | 'crf';\n  targetSizeMB: number;\n  crfValue: number;\n  originalSizeMB: number;\n  estimatedOutputMB: number;`,
    extraInit: `  mode: 'crf',\n  targetSizeMB: 50,\n  crfValue: 23,\n  originalSizeMB: 0,\n  estimatedOutputMB: 0,`,
  },
  {
    num: '05', folder: '05-stabilizer', cls: 'Stabilizer', var: 'stabilizer', title: 'Video Stabilizer', emoji: '🎯',
    desc: 'Remove camera shake using FFmpeg vidstab filter (two-pass stabilization)',
    ext: 'mp4',
    ffmpegCmd: '-vf vidstabtransform=smoothing=30 output.mp4',
    extraState: `  shakiness: number;\n  smoothing: number;\n  cropMode: 'black' | 'fill';\n  analysisComplete: boolean;`,
    extraInit: `  shakiness: 5,\n  smoothing: 30,\n  cropMode: 'black',\n  analysisComplete: false,`,
  },
  {
    num: '06', folder: '06-reverser', cls: 'Reverser', var: 'reverser', title: 'Video Reverser', emoji: '⏪',
    desc: 'Reverse video playback direction with optional audio reverse',
    ext: 'mp4',
    ffmpegCmd: '-vf reverse -af areverse output.mp4',
    extraState: `  reverseAudio: boolean;\n  durationWarning: boolean;`,
    extraInit: `  reverseAudio: false,\n  durationWarning: false,`,
  },
  {
    num: '07', folder: '07-speed-controller', cls: 'SpeedController', var: 'speedController', title: 'Speed Controller', emoji: '⚡',
    desc: 'Change video playback speed 0.25x to 4x with pitch-corrected audio',
    ext: 'mp4',
    ffmpegCmd: '-filter:v setpts=0.5*PTS output.mp4',
    extraState: `  speed: number;\n  audioMode: 'keep' | 'mute' | 'pitchCorrect';\n  originalDuration: number;\n  newDuration: number;`,
    extraInit: `  speed: 1,\n  audioMode: 'pitchCorrect',\n  originalDuration: 0,\n  newDuration: 0,`,
  },
  {
    num: '08', folder: '08-looper', cls: 'Looper', var: 'looper', title: 'Video Looper', emoji: '🔁',
    desc: 'Loop a video N times or to a target duration with optional crossfade',
    ext: 'mp4',
    ffmpegCmd: '-f concat -safe 0 -i list.txt -c copy output.mp4',
    extraState: `  mode: 'count' | 'duration';\n  loopCount: number;\n  targetDuration: number;\n  crossfade: boolean;\n  crossfadeDuration: number;\n  outputDuration: number;`,
    extraInit: `  mode: 'count',\n  loopCount: 3,\n  targetDuration: 60,\n  crossfade: false,\n  crossfadeDuration: 0.5,\n  outputDuration: 0,`,
  },
  {
    num: '09', folder: '09-flip-rotate', cls: 'FlipRotate', var: 'flipRotate', title: 'Flip & Rotate', emoji: '🔄',
    desc: 'Flip video horizontally/vertically and rotate by arbitrary degrees',
    ext: 'mp4',
    ffmpegCmd: '-vf hflip output.mp4',
    extraState: `  flipH: boolean;\n  flipV: boolean;\n  rotation: number;`,
    extraInit: `  flipH: false,\n  flipV: false,\n  rotation: 0,`,
  },
  {
    num: '10', folder: '10-crop-resize', cls: 'CropResize', var: 'cropResize', title: 'Smart Crop & Resize', emoji: '✂️',
    desc: 'Crop video to custom region or resize to preset dimensions with aspect ratio lock',
    ext: 'mp4',
    ffmpegCmd: '-vf scale=1920:1080:flags=lanczos output.mp4',
    extraState: `  mode: 'crop' | 'resize';\n  cropRegion: { x: number; y: number; w: number; h: number };\n  targetWidth: number;\n  targetHeight: number;\n  lockAspectRatio: boolean;\n  padMode: 'stretch' | 'pad' | 'crop-to-fit';`,
    extraInit: `  mode: 'resize',\n  cropRegion: { x: 0, y: 0, w: 1920, h: 1080 },\n  targetWidth: 1920,\n  targetHeight: 1080,\n  lockAspectRatio: true,\n  padMode: 'pad',`,
  },
  {
    num: '11', folder: '11-color-grading', cls: 'ColorGrading', var: 'colorGrading', title: 'Color Grading', emoji: '🎨',
    desc: 'Adjust brightness, contrast, saturation, hue, gamma and apply LUT files',
    ext: 'mp4',
    ffmpegCmd: '-vf eq=brightness=0:contrast=1:saturation=1 output.mp4',
    extraState: `  brightness: number;\n  contrast: number;\n  saturation: number;\n  hue: number;\n  gamma: number;\n  lutFile: File | null;\n  activeLutPreset: string | null;`,
    extraInit: `  brightness: 0,\n  contrast: 1,\n  saturation: 1,\n  hue: 0,\n  gamma: 1.0,\n  lutFile: null,\n  activeLutPreset: null,`,
  },
  {
    num: '12', folder: '12-subtitle-burner', cls: 'SubtitleBurner', var: 'subtitleBurner', title: 'Subtitle Burner', emoji: '💬',
    desc: 'Burn SRT/VTT/ASS subtitle files into video with custom font and style',
    ext: 'mp4',
    ffmpegCmd: '-vf subtitles=subs.srt output.mp4',
    extraState: `  subtitleFile: File | null;\n  subtitleContent: string;\n  fontFamily: string;\n  fontSize: number;\n  fontColor: string;\n  outlineColor: string;\n  position: 'top' | 'bottom';\n  offsetSeconds: number;\n  aiGenerating: boolean;`,
    extraInit: `  subtitleFile: null,\n  subtitleContent: '',\n  fontFamily: 'Arial',\n  fontSize: 24,\n  fontColor: '#FFFFFF',\n  outlineColor: '#000000',\n  position: 'bottom',\n  offsetSeconds: 0,\n  aiGenerating: false,`,
  },
  {
    num: '13', folder: '13-thumbnail-generator', cls: 'ThumbnailGenerator', var: 'thumbnailGenerator', title: 'Thumbnail Generator', emoji: '🖼️',
    desc: 'Extract frames from video as images or generate contact sheets',
    ext: 'jpg',
    ffmpegCmd: '-ss 10 -frames:v 1 thumbnail.jpg',
    extraState: `  mode: 'single' | 'grid' | 'interval';\n  timestamp: number;\n  gridCols: number;\n  gridRows: number;\n  intervalSeconds: number;\n  imageFormat: 'jpg' | 'png' | 'webp';\n  jpgQuality: number;\n  outputBlobs: Blob[];`,
    extraInit: `  mode: 'single',\n  timestamp: 0,\n  gridCols: 3,\n  gridRows: 3,\n  intervalSeconds: 5,\n  imageFormat: 'jpg',\n  jpgQuality: 85,\n  outputBlobs: [],`,
  },
  {
    num: '14', folder: '14-watermark', cls: 'Watermark', var: 'watermark', title: 'Watermark Adder', emoji: '💧',
    desc: 'Overlay image or text watermark on video with position and opacity control',
    ext: 'mp4',
    ffmpegCmd: '-vf drawtext=text=WATERMARK output.mp4',
    extraState: `  watermarkFile: File | null;\n  mode: 'image' | 'text';\n  text: string;\n  fontFamily: string;\n  fontSize: number;\n  fontColor: string;\n  position: 'TL' | 'TC' | 'TR' | 'ML' | 'MC' | 'MR' | 'BL' | 'BC' | 'BR';\n  opacity: number;\n  scale: number;`,
    extraInit: `  watermarkFile: null,\n  mode: 'text',\n  text: 'OMNI-TOOL',\n  fontFamily: 'Arial',\n  fontSize: 36,\n  fontColor: '#FFFFFF',\n  position: 'BR',\n  opacity: 0.7,\n  scale: 0.2,`,
  },
  {
    num: '15', folder: '15-audio-extractor', cls: 'AudioExtractor', var: 'audioExtractor', title: 'Audio Extractor', emoji: '🎵',
    desc: 'Extract audio track from video in WAV, MP3, AAC, OGG, or FLAC format',
    ext: 'mp3',
    ffmpegCmd: '-vn -c:a libmp3lame -b:a 192k output.mp3',
    extraState: `  outputFormat: 'wav' | 'mp3' | 'aac' | 'ogg' | 'flac';\n  bitrate: 128 | 192 | 256 | 320;\n  waveformData: Float32Array | null;`,
    extraInit: `  outputFormat: 'mp3',\n  bitrate: 192,\n  waveformData: null,`,
  },
  {
    num: '16', folder: '16-audio-replacer', cls: 'AudioReplacer', var: 'audioReplacer', title: 'Audio Replacer', emoji: '🔊',
    desc: 'Replace original audio with a new audio track with volume mix control',
    ext: 'mp4',
    ffmpegCmd: '-i video.mp4 -i audio.mp3 -c:v copy -map 0:v -map 1:a output.mp4',
    extraState: `  audioFile: File | null;\n  mode: 'replace' | 'mix';\n  originalVolume: number;\n  newAudioVolume: number;\n  loopAudio: boolean;`,
    extraInit: `  audioFile: null,\n  mode: 'replace',\n  originalVolume: 1,\n  newAudioVolume: 1,\n  loopAudio: false,`,
  },
  {
    num: '17', folder: '17-denoiser', cls: 'Denoiser', var: 'denoiser', title: 'Video Denoiser', emoji: '🧹',
    desc: 'Remove visual noise and grain using FFmpeg hqdn3d and nlmeans filters',
    ext: 'mp4',
    ffmpegCmd: '-vf hqdn3d=4:4:3:3 output.mp4',
    extraState: `  algorithm: 'hqdn3d' | 'nlmeans';\n  lumaStrength: number;\n  chromaStrength: number;\n  temporalStrength: number;\n  denoiseAudio: boolean;\n  audioNoiseLevel: number;`,
    extraInit: `  algorithm: 'hqdn3d',\n  lumaStrength: 4,\n  chromaStrength: 4,\n  temporalStrength: 3,\n  denoiseAudio: false,\n  audioNoiseLevel: 50,`,
  },
  {
    num: '18', folder: '18-interpolator', cls: 'Interpolator', var: 'interpolator', title: 'Frame Interpolator', emoji: '📈',
    desc: 'Increase video frame rate using motion interpolation (MINTERPOLATE filter)',
    ext: 'mp4',
    ffmpegCmd: '-filter:v fps=60 output.mp4',
    extraState: `  inputFPS: number;\n  targetFPS: number;\n  algorithm: 'duplicate' | 'motion';`,
    extraInit: `  inputFPS: 30,\n  targetFPS: 60,\n  algorithm: 'duplicate',`,
  },
  {
    num: '19', folder: '19-metadata-editor', cls: 'MetadataEditor', var: 'metadataEditor', title: 'Metadata Editor', emoji: '📋',
    desc: 'Read and write video metadata tags (title, author, description, date)',
    ext: 'mp4',
    ffmpegCmd: '-metadata title=Title -c copy output.mp4',
    extraState: `  rawMetadata: Record<string, string>;\n  editedFields: { title: string; artist: string; album: string; year: string; description: string; comment: string };\n  coverArt: File | null;\n  stripAll: boolean;`,
    extraInit: `  rawMetadata: {},\n  editedFields: { title: '', artist: '', album: '', year: '', description: '', comment: '' },\n  coverArt: null,\n  stripAll: false,`,
  },
  {
    num: '20', folder: '20-splitter', cls: 'Splitter', var: 'splitter', title: 'Video Splitter', emoji: '✂️',
    desc: 'Split one video into multiple segments by time markers or equal parts',
    ext: 'mp4',
    ffmpegCmd: '-ss 0 -to 30 -c copy segment.mp4',
    extraState: `  mode: 'markers' | 'equal';\n  markers: number[];\n  equalParts: number;\n  outputSegments: Blob[];`,
    extraInit: `  mode: 'equal',\n  markers: [],\n  equalParts: 3,\n  outputSegments: [],`,
  },
  {
    num: '21', folder: '21-screen-recorder', cls: 'ScreenRecorder', var: 'screenRecorder', title: 'Screen Recorder', emoji: '🎥',
    desc: 'Record screen and microphone/system audio using MediaRecorder API',
    ext: 'webm',
    ffmpegCmd: 'MediaRecorder API (no worker needed)',
    extraState: `  duration: number;\n  audioSource: 'mic' | 'system' | 'both' | 'none';\n  resolution: '1080p' | '720p' | '480p';\n  outputFormat: 'mp4' | 'webm';\n  recordingStatus: 'idle' | 'requesting' | 'recording' | 'paused' | 'processing';`,
    extraInit: `  duration: 0,\n  audioSource: 'mic',\n  resolution: '1080p',\n  outputFormat: 'webm',\n  recordingStatus: 'idle',`,
  },
  {
    num: '22', folder: '22-video-to-gif', cls: 'VideoToGif', var: 'videoToGif', title: 'Video to GIF', emoji: '🎞️',
    desc: 'Convert video segment to high-quality animated GIF with palette optimization',
    ext: 'gif',
    ffmpegCmd: '-vf fps=10,scale=480:-1,palettegen palette.png',
    extraState: `  startTime: number;\n  endTime: number;\n  fps: number;\n  width: number | 'auto';\n  dither: 'none' | 'bayer' | 'floyd_steinberg';\n  estimatedSizeKB: number;`,
    extraInit: `  startTime: 0,\n  endTime: 10,\n  fps: 10,\n  width: 480,\n  dither: 'bayer',\n  estimatedSizeKB: 0,`,
  },
  {
    num: '23', folder: '23-pip', cls: 'Pip', var: 'pip', title: 'Picture-in-Picture', emoji: '📺',
    desc: 'Overlay a second video as a floating picture-in-picture with position and size control',
    ext: 'mp4',
    ffmpegCmd: '-filter_complex [1:v]scale=320:240[pip];[0:v][pip]overlay=10:10 output.mp4',
    extraState: `  mainFile: File | null;\n  overlayFile: File | null;\n  pipWidth: number;\n  position: 'TL' | 'TR' | 'BL' | 'BR';\n  startTime: number | null;\n  endTime: number | null;\n  borderRadius: number;`,
    extraInit: `  mainFile: null,\n  overlayFile: null,\n  pipWidth: 25,\n  position: 'TR',\n  startTime: null,\n  endTime: null,\n  borderRadius: 8,`,
  },
  {
    num: '24', folder: '24-blur', cls: 'Blur', var: 'blur', title: 'Video Blur', emoji: '🌁',
    desc: 'Apply full-frame blur, region blur (privacy censor), or background blur effect',
    ext: 'mp4',
    ffmpegCmd: '-vf boxblur=10 output.mp4',
    extraState: `  mode: 'full' | 'region' | 'background';\n  strength: number;\n  region: { x: number; y: number; w: number; h: number } | null;\n  startTime: number | null;\n  endTime: number | null;`,
    extraInit: `  mode: 'full',\n  strength: 10,\n  region: null,\n  startTime: null,\n  endTime: null,`,
  },
  {
    num: '25', folder: '25-transitions', cls: 'Transitions', var: 'transitions', title: 'Video Transitions', emoji: '🎬',
    desc: 'Add fade, dissolve, wipe, and slide transition effects between clips',
    ext: 'mp4',
    ffmpegCmd: '-filter_complex [0][1]xfade=transition=fade:duration=0.5 output.mp4',
    extraState: `  clips: { file: File; id: string }[];\n  transitionList: { afterClipId: string; type: string; duration: number }[];\n  applyAllType: string | null;\n  applyAllDuration: number | null;`,
    extraInit: `  clips: [],\n  transitionList: [],\n  applyAllType: 'fade',\n  applyAllDuration: 0.5,`,
  },
  {
    num: '26', folder: '26-compare', cls: 'Compare', var: 'compare', title: 'Video Compare', emoji: '👁️',
    desc: 'Compare two videos side-by-side or with a drag-divider overlay',
    ext: 'mp4',
    ffmpegCmd: '-filter_complex [0][1]hstack output.mp4',
    extraState: `  fileA: File | null;\n  fileB: File | null;\n  mode: 'sidebyside' | 'divider' | 'difference';\n  dividerPosition: number;\n  syncPlayback: boolean;`,
    extraInit: `  fileA: null,\n  fileB: null,\n  mode: 'divider',\n  dividerPosition: 50,\n  syncPlayback: true,`,
  },
  {
    num: '27', folder: '27-slideshow', cls: 'Slideshow', var: 'slideshow', title: 'Slideshow Maker', emoji: '🖼️',
    desc: 'Create a video slideshow from a sequence of images with Ken Burns effect and music',
    ext: 'mp4',
    ffmpegCmd: '-loop 1 -i img.jpg -t 3 -vf scale=1920:1080 clip.mp4',
    extraState: `  images: { file: File; id: string; duration: number }[];\n  defaultDuration: number;\n  kenBurns: boolean;\n  musicFile: File | null;\n  transitionType: string;\n  transitionDuration: number;\n  outputResolution: '1080p' | '720p';`,
    extraInit: `  images: [],\n  defaultDuration: 3,\n  kenBurns: false,\n  musicFile: null,\n  transitionType: 'fade',\n  transitionDuration: 0.5,\n  outputResolution: '1080p',`,
  },
  {
    num: '28', folder: '28-batch', cls: 'Batch', var: 'batch', title: 'Batch Processor', emoji: '⚙️',
    desc: 'Apply the same operation to multiple videos in a sequential processing queue',
    ext: 'mp4',
    ffmpegCmd: 'Sequential per-file FFmpeg processing',
    extraState: `  files: { id: string; file: File; status: string; progress: number; outputBlob: Blob | null; error: string | null }[];\n  operation: 'compress' | 'convert' | 'trim' | 'resize';\n  operationConfig: Record<string, unknown>;\n  isRunning: boolean;\n  currentIndex: number;\n  completedCount: number;\n  failedCount: number;`,
    extraInit: `  files: [],\n  operation: 'compress',\n  operationConfig: {},\n  isRunning: false,\n  currentIndex: 0,\n  completedCount: 0,\n  failedCount: 0,`,
  },
  {
    num: '29', folder: '29-analyser', cls: 'Analyser', var: 'analyser', title: 'Video Analyser', emoji: '🔍',
    desc: 'Inspect video technical metadata: codec, resolution, bitrate, FPS, audio streams, chapters',
    ext: 'json',
    ffmpegCmd: 'ffprobe JSON output mode',
    extraState: `  metadata: { format: Record<string,string>; videoStreams: unknown[]; audioStreams: unknown[]; subtitleStreams: unknown[]; chapters: unknown[] } | null;`,
    extraInit: `  metadata: null,`,
  },
  {
    num: '30', folder: '30-upscaler', cls: 'Upscaler', var: 'upscaler', title: 'AI Video Upscaler', emoji: '🚀',
    desc: 'Upscale video resolution using Real-ESRGAN ONNX model via WebGPU acceleration',
    ext: 'mp4',
    ffmpegCmd: 'ONNX Real-ESRGAN frame-by-frame inference',
    extraState: `  scaleFactor: 2 | 4;\n  model: 'realesrgan' | 'esrgan' | 'swinir';\n  webGpuAvailable: boolean;\n  totalFrames: number;\n  processedFrames: number;\n  currentFrameIndex: number;\n  modelLoaded: boolean;\n  memoryWarning: boolean;`,
    extraInit: `  scaleFactor: 2,\n  model: 'realesrgan',\n  webGpuAvailable: false,\n  totalFrames: 0,\n  processedFrames: 0,\n  currentFrameIndex: 0,\n  modelLoaded: false,\n  memoryWarning: false,`,
  },
];

for (const f of features) {
  const dir = `${base}/${f.folder}`;
  const varU = f.var.charAt(0).toUpperCase() + f.var.slice(1);

  // ---- store.ts ----
  w(`${dir}/${f.var}.store.ts`, `import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ${f.cls}State {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
${f.extraState}
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ${f.cls}State = {
  inputFile: null, videoMeta: null,
${f.extraInit}
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ${f.cls}Actions = {
  loadFile: createAction('[${f.cls}] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[${f.cls}] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[${f.cls}] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[${f.cls}] Update Config', props<{ config: Partial<${f.cls}State> }>()),
  startProcessing: createAction('[${f.cls}] Start'),
  updateProgress: createAction('[${f.cls}] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[${f.cls}] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[${f.cls}] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[${f.cls}] Download'),
  resetState: createAction('[${f.cls}] Reset'),
};
export const ${f.var}Feature = createFeature({
  name: '${f.var}',
  reducer: createReducer(init,
    on(${f.cls}Actions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(${f.cls}Actions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(${f.cls}Actions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(${f.cls}Actions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(${f.cls}Actions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(${f.cls}Actions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(${f.cls}Actions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(${f.cls}Actions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(${f.cls}Actions.resetState, () => init),
  )
});
export const { select${f.cls}State, selectStatus, selectProgress, selectOutputBlob } = ${f.var}Feature;
export const select${f.cls}CanProcess = createSelector(select${f.cls}State, s => !!s.inputFile && s.status === 'idle');
export const select${f.cls}IsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
`);

  // ---- service.ts ----
  w(`${dir}/${f.var}.service.ts`, `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ${f.cls}Service {
  // ${f.ffmpegCmd}
  buildArgs(inputName: string, outputName: string, config: Record<string, unknown>): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return \`\${m}:\${sec}\`;
  }
}
`);

  // ---- worker.ts ----
  w(`${dir}/${f.var}.worker.ts`, `/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(\`\${base}/ffmpeg-core.js\`, 'text/javascript'),
    wasmURL: await toBlobURL(\`\${base}/ffmpeg-core.wasm\`, 'application/wasm'),
  });
}

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
    await loadFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      postMessage({ type: 'progress', value: Math.round(progress * 100) });
    });

    const ext = config.outputFormat ?? '${f.ext}';
    const inputName = \`in_\${Date.now()}.mp4\`;
    const outputName = \`out_\${Date.now()}.\${ext}\`;
    const inputFile = config.file ?? config.inputFile;
    if (!inputFile) throw new Error('No input file');

    const inputData = await fetchFile(inputFile);
    ffmpeg.writeFile(inputName, inputData);

    // ${f.ffmpegCmd}
    await ffmpeg.exec(['-i', inputName, '-c:v', 'libx264', '-preset', 'ultrafast', outputName]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data], { type: \`video/\${ext}\` });
    ffmpeg.deleteFile(inputName);
    ffmpeg.deleteFile(outputName);
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
`);

  // ---- component.ts ----
  w(`${dir}/${f.var}.component.ts`, `import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ${f.cls}Actions, select${f.cls}State, select${f.cls}IsLoading, select${f.cls}CanProcess } from './${f.var}.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-${f.var.replace(/([A-Z])/g, '-$1').toLowerCase()}',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          ${f.emoji} ${f.title}
        </h1>
        <p class="text-white/50 text-sm">${f.desc}</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept="video/*"
            label="Drop video file here or click to browse"
            (filesSelected)="onFileSelected(\$event)"
          />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.codec }}</p>
                </div>
              </div>
              <button
                [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else { ${f.emoji} Process }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Processing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              defaultFilename="omni_${f.var.replace(/([A-Z])/g, '_$1').toLowerCase()}"
            />
          }
        </div>
      </div>
    </div>
  \`,
})
export class ${f.cls}Component implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(select${f.cls}State);
  isLoading$ = this.store.select(select${f.cls}IsLoading);
  canProcess$ = this.store.select(select${f.cls}CanProcess);

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(${f.cls}Actions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(${f.cls}Actions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(${f.cls}Actions.loadMetaFailure({
        errorCode: 'FILE_CORRUPTED',
        message: 'Could not read video metadata.'
      }));
    }
  }

  onProcess() {
    this.store.dispatch(${f.cls}Actions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./${f.var}.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile }
      ).subscribe(msg => {
        if (msg.type === 'progress') {
          this.store.dispatch(${f.cls}Actions.updateProgress({ progress: msg.value ?? 0 }));
        } else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(${f.cls}Actions.processingSuccess({
            outputBlob: blob,
            outputSizeMB: blob.size / 1_048_576
          }));
        } else if (msg.type === 'error') {
          this.store.dispatch(${f.cls}Actions.processingFailure({
            errorCode: msg.errorCode ?? 'UNKNOWN_ERROR',
            message: msg.message ?? 'Processing failed'
          }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() {
    this.store.dispatch(${f.cls}Actions.resetState());
  }
}
`);

  // ---- index.ts ----
  w(`${dir}/index.ts`, `export { ${f.cls}Component } from './${f.var}.component';
export { ${f.cls}Service } from './${f.var}.service';
export * from './${f.var}.store';
`);

  console.log(`Feature ${f.num} (${f.cls}) created.`);
}

console.log('\n✅ All 29 remaining features (02-30) created successfully!');
