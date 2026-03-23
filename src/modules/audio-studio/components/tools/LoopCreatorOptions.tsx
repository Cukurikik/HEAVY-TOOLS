"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function LoopCreatorOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Number of Loops (Total Plays)</label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="2" max="100" step="1"
            value={(opts.loops as number) ?? 3}
            onChange={(e) => setOptions({ loops: parseInt(e.target.value) })}
            className="flex-1 accent-pink-500"
          />
          <div className="w-20 text-center">
            <span className="text-pink-400 font-mono text-xl bg-pink-500/10 px-3 py-2 rounded-xl border border-pink-500/20 block">
              x{(opts.loops as number) ?? 3}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
          <span>2x (Double)</span>
          <span>100x (Infinite)</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        Example: If you upload a 5-second drum beat and set it to 4x loops, the output will be a 20-second continuous loop. The engine uses lossless stream copying for instantaneous rendering.
      </p>
    </div>
  );
}
