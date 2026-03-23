"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function NormalizerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const isPeak = opts.mode === "peak";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Normalization Mode</label>
        <select
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none"
          value={(opts.mode as string) || "loudnorm"}
          onChange={(e) => setOptions({ mode: e.target.value })}
        >
          <option value="loudnorm">EBU R128 Loudness Normalization (Recommended)</option>
          <option value="peak">Dynamic Peak Normalization (legacy)</option>
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Loudness (LUFS) matches human perception. Peak only looks at max volume.
        </p>
      </div>

      {!isPeak && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">Target Loudness</label>
              <span className="text-lime-400 font-mono text-xs bg-lime-500/10 px-2 py-1 rounded">
                {(opts.targetLoudness as number) ?? -16} LUFS
              </span>
            </div>
            <input
              type="range"
              min="-30" max="-5" step="1"
              value={(opts.targetLoudness as number) ?? -16}
              onChange={(e) => setOptions({ targetLoudness: parseFloat(e.target.value) })}
              className="w-full accent-lime-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">Target True Peak</label>
              <span className="text-lime-400 font-mono text-xs bg-lime-500/10 px-2 py-1 rounded">
                {(opts.truePeak as number) ?? -1.5} dBTP
              </span>
            </div>
            <input
              type="range"
              min="-5" max="0" step="0.1"
              value={(opts.truePeak as number) ?? -1.5}
              onChange={(e) => setOptions({ truePeak: parseFloat(e.target.value) })}
              className="w-full accent-lime-500"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">Target Loudness Range (LRA)</label>
              <span className="text-lime-400 font-mono text-xs bg-lime-500/10 px-2 py-1 rounded">
                {(opts.lra as number) ?? 11} LU
              </span>
            </div>
            <input
              type="range"
              min="1" max="20" step="1"
              value={(opts.lra as number) ?? 11}
              onChange={(e) => setOptions({ lra: parseFloat(e.target.value) })}
              className="w-full accent-lime-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
