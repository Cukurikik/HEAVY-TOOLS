"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function CompressorOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "threshold", label: "Threshold", min: -60, max: 0, step: 1, unit: "dB", default: -20 },
    { id: "ratio", label: "Ratio", min: 1, max: 20, step: 0.5, unit: ":1", default: 4 },
    { id: "attack", label: "Attack", min: 0.1, max: 2000, step: 1, unit: "ms", default: 5 },
    { id: "release", label: "Release", min: 10, max: 4000, step: 10, unit: "ms", default: 50 },
    { id: "knee", label: "Knee", min: 1, max: 8, step: 0.1, unit: "dB", default: 2.8 },
    { id: "makeup", label: "Makeup Gain", min: 0, max: 24, step: 1, unit: "dB", default: 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {controls.map((ctrl) => (
        <div key={ctrl.id} className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">{ctrl.label}</label>
            <span className="text-orange-400 font-mono text-xs bg-orange-500/10 px-2 py-1 rounded">
              {(opts[ctrl.id] as number) ?? ctrl.default}{ctrl.unit}
            </span>
          </div>
          <input
            type="range"
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            value={(opts[ctrl.id] as number) ?? ctrl.default}
            onChange={(e) => setOptions({ [ctrl.id]: parseFloat(e.target.value) })}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
            <span>{ctrl.min}{ctrl.unit}</span>
            <span>{ctrl.max}{ctrl.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
