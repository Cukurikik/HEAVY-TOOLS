"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { VideoToolInterface, VIDEO_TOOLS } from "@/modules/video-engine";
import {
  TrimmerOptions, MergerOptions, ConverterOptions, CompressorOptions, FlipperOptions, RotatorOptions,
  StabilizerOptions, ReverseOptions, SpeedControlOptions, LoopEngineOptions, ProEditorOptions,
  ThumbnailExtractorOptions, SubtitleBurnerOptions, WatermarkOptions, NoiseReducerOptions,
  ColorGraderOptions, ResolutionUpscalerOptions, FrameInterpolatorOptions, GifConverterOptions,
  HdrTonemapperOptions, BlackWhiteOptions, SlowMotionOptions, TimelapseOptions, ScreenRecorderOptions,
  MetadataEditorOptions, BatchProcessorOptions, ChapterMarkerOptions, AudioExtractorOptions,
  VideoSplitterOptions, AspectRatioOptions
} from "@/modules/video-engine/components/tools";
import type { VideoOperation } from "@/modules/video-engine/types";

const OPTIONS_MAP: Record<string, React.FC> = {
  trimmer: TrimmerOptions,
  merger: MergerOptions,
  converter: ConverterOptions,
  compressor: CompressorOptions,
  flipper: FlipperOptions,
  rotator: RotatorOptions,
  stabilizer: StabilizerOptions,
  reverse: ReverseOptions,
  'speed-control': SpeedControlOptions,
  'loop-engine': LoopEngineOptions,
  'pro-editor': ProEditorOptions,
  'thumbnail-extractor': ThumbnailExtractorOptions,
  'subtitle-burner': SubtitleBurnerOptions,
  watermark: WatermarkOptions,
  'noise-reducer': NoiseReducerOptions,
  'color-grader': ColorGraderOptions,
  'resolution-upscaler': ResolutionUpscalerOptions,
  'frame-interpolator': FrameInterpolatorOptions,
  'gif-converter': GifConverterOptions,
  'hdr-tonemapper': HdrTonemapperOptions,
  'black-white': BlackWhiteOptions,
  'slow-motion': SlowMotionOptions,
  timelapse: TimelapseOptions,
  'screen-recorder': ScreenRecorderOptions,
  'metadata-editor': MetadataEditorOptions,
  'batch-processor': BatchProcessorOptions,
  'chapter-marker': ChapterMarkerOptions,
  'audio-extractor': AudioExtractorOptions,
  'video-splitter': VideoSplitterOptions,
  'aspect-ratio': AspectRatioOptions
};

export default function VideoToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const unwrappedParams = use(params);
  const toolId = unwrappedParams.tool;
  
  const toolDef = VIDEO_TOOLS.find(t => t.id === toolId);
  if (!toolDef) {
    notFound();
  }

  const OptionsComponent = OPTIONS_MAP[toolId];
  
  const isScreenRecorder = toolId === 'screen-recorder';
  const isMultiFile = toolId === 'merger' || toolId === 'batch-processor';

  return (
    <div className="p-4 md:p-8">
      <VideoToolInterface
        toolId={toolId as VideoOperation}
        title={toolDef.name}
        description={toolDef.description}
        options={OptionsComponent ? <OptionsComponent /> : undefined}
        isScreenRecorder={isScreenRecorder}
        isMultiFile={isMultiFile}
      />
    </div>
  );
}
