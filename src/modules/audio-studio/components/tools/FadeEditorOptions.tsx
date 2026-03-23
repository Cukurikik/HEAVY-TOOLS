"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function FadeEditorOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">Fade-In Duration</label>
              <span className="text-orange-400 font-mono text-xs bg-orange-500/10 px-2 py-1 rounded">
                {(opts.fadeIn as number) ?? 2} s
              </span>
            </div>
            <input
              type="range"
              min="0" max="10" step="0.5"
              value={(opts.fadeIn as number) ?? 2}
              onChange={(e) => setOptions({ fadeIn: parseFloat(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Fade-In Curve</label>
            <select
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-orange-500 outline-none"
              value={(opts.curveIn as string) || "tri"}
              onChange={(e) => setOptions({ curveIn: e.target.value })}
            >
              <option value="tri">Linear (Standard)</option>
              <option value="exp">Exponential (Fast Start)</option>
              <option value="qsin">Quarter Sine (Smooth)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">Fade-Out Duration</label>
              <span className="text-orange-400 font-mono text-xs bg-orange-500/10 px-2 py-1 rounded">
                {(opts.fadeOut as number) ?? 3} s
              </span>
            </div>
            <input
              type="range"
              min="0" max="10" step="0.5"
              value={(opts.fadeOut as number) ?? 3}
              onChange={(e) => setOptions({ fadeOut: parseFloat(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Fade-Out Curve</label>
            <select
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-orange-500 outline-none"
              value={(opts.curveOut as string) || "tri"}
              onChange={(e) => setOptions({ curveOut: e.target.value })}
            >
              <option value="tri">Linear (Standard)</option>
              <option value="exp">Exponential (Fast End)</option>
              <option value="qsin">Quarter Sine (Smooth)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
