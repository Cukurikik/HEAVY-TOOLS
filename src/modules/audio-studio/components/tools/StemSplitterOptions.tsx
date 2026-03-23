"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function StemSplitterOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Extraction Target</label>
        <select
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
          value={(opts.stem as string) || "vocals"}
          onChange={(e) => setOptions({ stem: e.target.value })}
        >
          <option value="vocals">Vocals Only</option>
          <option value="instruments">Instruments Only (Instrumental)</option>
        </select>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          <strong className="text-rose-400">Note:</strong> Uses phase-cancellation algorithm via FFmpeg OOB. This separates center-panned audio (vocals) from hard-panned audio (instruments).
        </p>
      </div>
    </div>
  );
}
