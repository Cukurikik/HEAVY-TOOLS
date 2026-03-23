"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function BpmDetectorOptions() {
  const { task } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
        <h4 className="text-xl font-black text-rose-400 mb-2">
          {opts.detectedBpm ? `${opts.detectedBpm} BPM` : "Analyzation Pending"}
        </h4>
        <p className="text-xs text-rose-200/60 font-medium">
          Upload an audio file to automatically detect its tempo (Beats Per Minute) using FFT analysis.
        </p>
      </div>
    </div>
  );
}
