"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function SpatialAudioOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Spatialization Mode</label>
        <select
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
          value={(opts.mode as string) || "surround"}
          onChange={(e) => setOptions({ mode: e.target.value })}
        >
          <option value="surround">8D / Surround Sound (Immersive)</option>
          <option value="wide">Ultra Wide Stereo (Expansive)</option>
          <option value="mono">Folddown to Mono (Center Focus)</option>
        </select>
      </div>

      {(opts.mode as string || "surround") !== "mono" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {(opts.mode as string || "surround") === "surround" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-slate-400">Echo Depth</label>
                <span className="text-indigo-400 font-mono text-xs bg-indigo-500/10 px-2 py-1 rounded">
                  {(opts.echoDepth as number) ?? 40} ms
                </span>
              </div>
              <input
                type="range"
                min="10" max="150" step="5"
                value={(opts.echoDepth as number) ?? 40}
                onChange={(e) => setOptions({ echoDepth: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">Stereo Expansion</label>
              <span className="text-indigo-400 font-mono text-xs bg-indigo-500/10 px-2 py-1 rounded">
                {((opts.width as number) ?? 1.0).toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5" max="3.0" step="0.1"
              value={(opts.width as number) ?? 1.0}
              onChange={(e) => setOptions({ width: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
