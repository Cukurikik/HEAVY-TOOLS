"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function NoiseRemoverOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "noiseFloor", label: "Noise Floor Estimate", min: -80, max: -20, step: 1, unit: " dB", default: -30 },
    { id: "reduction", label: "Noise Reduction Amount", min: 0, max: 80, step: 1, unit: " dB", default: 12 },
  ];

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <h4 className="text-red-400 font-bold mb-1">FFT Denoise Algorithm</h4>
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Removes background hum, hiss, and static. Set the Floor to match the background noise level, and adjust Reduction to clean the audio. Too much reduction sounds underwater.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {controls.map((ctrl) => (
          <div key={ctrl.id} className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-400">{ctrl.label}</label>
              <span className="text-red-400 font-mono text-xs bg-red-500/10 px-2 py-1 rounded">
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
              className="w-full accent-red-500"
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
