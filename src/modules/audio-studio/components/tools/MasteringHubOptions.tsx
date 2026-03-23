"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function MasteringHubOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const controls = [
    { id: "loudness", label: "Target Loudness (LUFS)", min: -24, max: -8, step: 1, unit: " dB", default: -14 },
    { id: "ceiling", label: "True Peak Ceiling", min: -3, max: 0, step: 0.1, unit: " dBTP", default: -1.0 },
    { id: "lra", label: "Loudness Range (LRA)", min: 1, max: 20, step: 1, unit: " LU", default: 11 },
    { id: "compRatio", label: "Master Compression Ratio", min: 1, max: 10, step: 0.1, unit: ":1", default: 4 },
  ];

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <h4 className="text-orange-400 font-bold mb-1">Standard Broadcast Targets</h4>
        <p className="text-xs text-orange-200/60 leading-relaxed font-medium">
          Spotify/YouTube: -14 LUFS, -1 dBTP<br/>
          Apple Music: -16 LUFS, -1 dBTP<br/>
          Netflix/TV: -24 LUFS, -2 dBTP
        </p>
      </div>

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
    </div>
  );
}
