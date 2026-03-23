"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function SilenceRemoverOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "threshold", label: "Silence Threshold", min: -80, max: -20, step: 1, unit: " dB", default: -40 },
    { id: "minDuration", label: "Minimum Silence Duration", min: 0.1, max: 5.0, step: 0.1, unit: " s", default: 0.5 },
  ];

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
        <h4 className="text-yellow-400 font-bold mb-1">Auto-Truncate Algorithm</h4>
        <p className="text-xs text-yellow-200/60 leading-relaxed font-medium">
          Automatically removes sections of audio where the volume drops below the threshold for longer than the minimum duration. Useful for cleaning up dialogue or podcasts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {controls.map((ctrl) => (
          <div key={ctrl.id} className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">{ctrl.label}</label>
              <span className="text-yellow-400 font-mono text-xs bg-yellow-500/10 px-2 py-1 rounded">
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
              className="w-full accent-yellow-500"
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
