"use client";
import { useAudioStore } from "../../store/useAudioStore";
import { Switch } from "@/components/ui/switch";

export function PitchShifterOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-slate-400">Semitones (Pitch)</label>
          <span className="text-indigo-400 font-mono text-xs bg-indigo-500/10 px-2 py-1 rounded">
            {(opts.semitones as number) ?? 0} st
          </span>
        </div>
        <input
          type="range"
          min="-24"
          max="24"
          step="1"
          value={(opts.semitones as number) ?? 0}
          onChange={(e) => setOptions({ semitones: parseFloat(e.target.value) })}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
          <span>-24 (-2 Octaves)</span>
          <span>0 (Original)</span>
          <span>+24 (+2 Octaves)</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
        <div>
          <p className="font-bold text-white">Preserve Original Tempo</p>
          <p className="text-xs text-slate-500 mt-1">
            If off, raising pitch will speed up the audio (like a vinyl record).
          </p>
        </div>
        <Switch
          checked={opts.preserveTempo !== false}
          onCheckedChange={(checked) => setOptions({ preserveTempo: checked })}
        />
      </div>
    </div>
  );
}
