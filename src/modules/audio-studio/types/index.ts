export type AudioOperation =
  | "trimmer"
  | "merger"
  | "converter"
  | "mastering-hub"
  | "stem-splitter"
  | "pitch-shifter"
  | "time-stretch"
  | "noise-remover"
  | "equalizer"
  | "compressor"
  | "reverb"
  | "normalizer"
  | "silence-remover"
  | "voice-isolator"
  | "bass-booster"
  | "stereo-panner"
  | "audio-reverser"
  | "waveform-visualizer"
  | "metadata-editor"
  | "bpm-detector"
  | "key-finder"
  | "batch-processor"
  | "audio-splitter"
  | "podcast-enhancer"
  | "voice-recorder"
  | "spectrum-analyzer"
  | "fade-editor"
  | "loop-creator"
  | "karaoke-maker"
  | "spatial-audio"
  | "audio-recorder";

export interface AudioTask {
  id: string;
  file: File | null;
  files: File[];
  operation: AudioOperation | "idle";
  options: Record<string, unknown>;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  resultUrl: string;
  error: string;
}
