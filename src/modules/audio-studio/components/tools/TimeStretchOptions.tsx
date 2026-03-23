"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function TimeStretchOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-slate-400">Playback Speed (Tempo)</label>
          <span className="text-fuchsia-400 font-mono text-xs bg-fuchsia-500/10 px-2 py-1 rounded">
            {((opts.tempo as number) ?? 1.0).toFixed(2)}x
          </span>
        </div>
        <input
          type="range"
          min="0.25"
          max="4.0"
          step="0.05"
          value={(opts.tempo as number) ?? 1.0}
          onChange={(e) => setOptions({ tempo: parseFloat(e.target.value) })}
          className="w-full accent-fuchsia-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
          <span>0.25x (Very Slow)</span>
          <span>1.0x (Normal)</span>
          <span>4.0x (Very Fast)</span>
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
        <h4 className="text-fuchsia-400 font-bold mb-1">Constant Pitch Algorithm</h4>
        <p className="text-xs text-fuchsia-200/60 leading-relaxed font-medium">
          Time stretching changes the tempo without affecting the pitch. Extreme values (&lt;0.5x or &gt;2.0x) may introduce artifacts.
        </p>
      </div>
    </div>
  );
}
