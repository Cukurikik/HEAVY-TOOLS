"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function ReverbOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "roomSize", label: "Room Size (Delay ms)", min: 10, max: 200, step: 1, unit: " ms", default: 60 },
    { id: "dampening", label: "Dampening (Decay)", min: 0.1, max: 1.0, step: 0.1, unit: "", default: 0.4 },
    { id: "wetDry", label: "Wet/Dry Mix", min: 0.1, max: 1.0, step: 0.1, unit: "", default: 0.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {controls.map((ctrl) => (
          <div key={ctrl.id} className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">{ctrl.label}</label>
              <span className="text-teal-400 font-mono text-xs bg-teal-500/10 px-2 py-1 rounded">
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
              className="w-full accent-teal-500"
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
