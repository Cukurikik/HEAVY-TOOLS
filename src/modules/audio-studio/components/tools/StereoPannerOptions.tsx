"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function StereoPannerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "pan", label: "Pan Position", min: -1, max: 1, step: 0.1, unit: "", default: 0 },
    { id: "width", label: "Stereo Width", min: -1, max: 3, step: 0.1, unit: "", default: 1 },
  ];

  const getPanLabel = (val: number) => {
    if (val === 0) return "Center";
    if (val < 0) return `${Math.abs(val * 100).toFixed(0)}% Left`;
    return `${(val * 100).toFixed(0)}% Right`;
  };

  const getWidthLabel = (val: number) => {
    if (val === 1) return "1.0 (Normal)";
    if (val > 1) return `${val.toFixed(1)} (Wide)`;
    if (val === 0) return "0.0 (Mono)";
    if (val < 0) return `${val.toFixed(1)} (Inverted)`;
    return val.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Pan Position</label>
            <span className="text-sky-400 font-mono text-xs bg-sky-500/10 px-2 py-1 rounded">
              {getPanLabel((opts.pan as number) ?? 0)}
            </span>
          </div>
          <input
            type="range"
            min="-1" max="1" step="0.1"
            value={(opts.pan as number) ?? 0}
            onChange={(e) => setOptions({ pan: parseFloat(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
            <span>Left (-1.0)</span>
            <span>Center (0.0)</span>
            <span>Right (1.0)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Stereo Width</label>
            <span className="text-sky-400 font-mono text-xs bg-sky-500/10 px-2 py-1 rounded">
              {getWidthLabel((opts.width as number) ?? 1)}
            </span>
          </div>
          <input
            type="range"
            min="-1" max="3" step="0.1"
            value={(opts.width as number) ?? 1}
            onChange={(e) => setOptions({ width: parseFloat(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
            <span>Invert (-1.0)</span>
            <span>Mono (0.0)</span>
            <span>Wide (3.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
