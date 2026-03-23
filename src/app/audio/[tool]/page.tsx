"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AudioToolInterface } from "@/modules/audio-studio/components/AudioToolInterface";
import { useAudioStore } from "@/modules/audio-studio/store/useAudioStore";
import { AUDIO_TOOLS } from "@/modules/audio-studio/constants/tools";
import { AudioOperation } from "@/modules/audio-studio/types";
import {
  TrimmerOptions, MergerOptions, ConverterOptions, MasteringHubOptions,
  StemSplitterOptions, PitchShifterOptions, TimeStretchOptions, NoiseRemoverOptions,
  EqualizerOptions, CompressorOptions, ReverbOptions, NormalizerOptions,
  SilenceRemoverOptions, VoiceIsolatorOptions, BassBoosterOptions, StereoPannerOptions,
  AudioReverserOptions, MetadataEditorOptions, BpmDetectorOptions, KeyFinderOptions,
  BatchProcessorOptions, AudioSplitterOptions, PodcastEnhancerOptions, VoiceRecorderOptions,
  SpectrumAnalyzerOptions, FadeEditorOptions, LoopCreatorOptions, KaraokeMakerOptions,
  SpatialAudioOptions, AudioRecorderOptions,
} from "@/modules/audio-studio/components/tools";

const OPTIONS_MAP: Record<string, React.ReactNode> = {
  "trimmer": <TrimmerOptions />,
  "merger": <MergerOptions />,
  "converter": <ConverterOptions />,
  "mastering-hub": <MasteringHubOptions />,
  "stem-splitter": <StemSplitterOptions />,
  "pitch-shifter": <PitchShifterOptions />,
  "time-stretch": <TimeStretchOptions />,
  "noise-remover": <NoiseRemoverOptions />,
  "equalizer": <EqualizerOptions />,
  "compressor": <CompressorOptions />,
  "reverb": <ReverbOptions />,
  "normalizer": <NormalizerOptions />,
  "silence-remover": <SilenceRemoverOptions />,
  "voice-isolator": <VoiceIsolatorOptions />,
  "bass-booster": <BassBoosterOptions />,
  "stereo-panner": <StereoPannerOptions />,
  "audio-reverser": <AudioReverserOptions />,
  "metadata-editor": <MetadataEditorOptions />,
  "bpm-detector": <BpmDetectorOptions />,
  "key-finder": <KeyFinderOptions />,
  "batch-processor": <BatchProcessorOptions />,
  "audio-splitter": <AudioSplitterOptions />,
  "podcast-enhancer": <PodcastEnhancerOptions />,
  "voice-recorder": <VoiceRecorderOptions />,
  "spectrum-analyzer": <SpectrumAnalyzerOptions />,
  "fade-editor": <FadeEditorOptions />,
  "loop-creator": <LoopCreatorOptions />,
  "karaoke-maker": <KaraokeMakerOptions />,
  "spatial-audio": <SpatialAudioOptions />,
  "audio-recorder": <AudioRecorderOptions />,
};

const RECORDER_TOOLS = ["voice-recorder", "audio-recorder"];
const MULTI_FILE_TOOLS = ["merger", "batch-processor"];
const ANALYZER_TOOLS = ["waveform-visualizer", "spectrum-analyzer", "bpm-detector", "key-finder"];

export default function AudioToolPage() {
  const params = useParams();
  const toolId = params.tool as string;
  const { setOperation } = useAudioStore();

  useEffect(() => {
    setOperation(toolId as AudioOperation);
  }, [toolId, setOperation]);

  const toolDef = AUDIO_TOOLS.find((t) => t.id === toolId);
  if (!toolDef) {
    return (
      <div className="p-8 text-center text-white">
        <h1 className="text-3xl font-black">Tool Not Found</h1>
        <p className="text-slate-400 mt-2">The audio tool &quot;{toolId}&quot; does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AudioToolInterface
        toolId={toolId as AudioOperation}
        title={toolDef.name}
        description={toolDef.desc}
        options={OPTIONS_MAP[toolId]}
        isRecorder={RECORDER_TOOLS.includes(toolId)}
        isMultiFile={MULTI_FILE_TOOLS.includes(toolId)}
        isAnalyzer={ANALYZER_TOOLS.includes(toolId)}
      />
    </div>
  );
}
