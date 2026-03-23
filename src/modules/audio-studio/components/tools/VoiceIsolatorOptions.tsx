"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function VoiceIsolatorOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Extraction Target</label>
        <select
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
          value={(opts.mode as string) || "vocals"}
          onChange={(e) => setOptions({ mode: e.target.value })}
        >
          <option value="vocals">Isolate Center Channel (Vocals/Dialogue)</option>
          <option value="instruments">Isolate Side Channels (Instruments/Backing)</option>
        </select>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          <strong className="text-purple-400">How it works:</strong> Many stereo tracks pan vocals to the dead center, while panning instruments left and right. This tool uses phase cancellation (OOB filter) to isolate center vs side audio. It works best on high-quality stereo files.
        </p>
      </div>
    </div>
  );
}
