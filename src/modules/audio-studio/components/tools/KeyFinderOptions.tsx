"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function KeyFinderOptions() {
  const { task } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
        <h4 className="text-2xl font-black text-amber-400 mb-2">
          {opts.detectedKey as string || "Analyzation Pending"}
        </h4>
        <p className="text-xs text-amber-200/60 font-medium">
          Upload an audio file to automatically detect its musical key (e.g. C Major, A Minor) using chromagram analysis.
        </p>
      </div>
    </div>
  );
}
