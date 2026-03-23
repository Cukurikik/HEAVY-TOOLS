"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function BassBoosterOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "gain", label: "Bass Gain", min: 0, max: 24, step: 1, unit: " dB", default: 10 },
    { id: "frequency", label: "Center Frequency", min: 40, max: 200, step: 10, unit: " Hz", default: 100 },
    { id: "width", label: "Bandwidth / Resonance", min: 50, max: 500, step: 10, unit: " Hz", default: 200 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {controls.map((ctrl) => (
          <div key={ctrl.id} className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">{ctrl.label}</label>
              <span className="text-slate-400 font-mono text-xs bg-slate-500/10 px-2 py-1 rounded">
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
              className="w-full accent-slate-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
              <span>{ctrl.min}{ctrl.unit}</span>
              <span>{ctrl.max}{ctrl.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
