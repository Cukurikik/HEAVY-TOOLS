"use client";
import { useAudioStore } from "../../store/useAudioStore";
import { BarChart3 as EqIcon } from "lucide-react";

export function EqualizerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const bands = [
    { id: "sub", label: "Sub (60 Hz)", color: "text-violet-400", bg: "bg-violet-500/10", accent: "accent-violet-500" },
    { id: "bass", label: "Bass (200 Hz)", color: "text-blue-400", bg: "bg-blue-500/10", accent: "accent-blue-500" },
    { id: "mid", label: "Mid (1 kHz)", color: "text-emerald-400", bg: "bg-emerald-500/10", accent: "accent-emerald-500" },
    { id: "presence", label: "Presence (4 kHz)", color: "text-yellow-400", bg: "bg-yellow-500/10", accent: "accent-yellow-500" },
    { id: "treble", label: "Treble (10 kHz)", color: "text-orange-400", bg: "bg-orange-500/10", accent: "accent-orange-500" },
  ];

  const resetEq = () => {
    setOptions({ sub: 0, bass: 0, mid: 0, presence: 0, treble: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-cyan-400">
          <EqIcon className="w-5 h-5" />
          <span className="font-bold text-sm tracking-widest uppercase">Parametric EQ</span>
        </div>
        <button
          onClick={resetEq}
          className="text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg transition-all"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 h-64">
        {bands.map((band) => {
          const val = (opts[band.id] as number) ?? 0;
          return (
            <div key={band.id} className="flex flex-col items-center h-full">
              <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md mb-4 ${band.bg} ${band.color}`}>
                {val > 0 ? "+" : ""}{val}dB
              </span>
              
              <div className="relative flex-1 flex justify-center w-full">
                <input
                  type="range"
                  min="-24"
                  max="24"
                  step="1"
                  value={val}
                  onChange={(e) => setOptions({ [band.id]: parseFloat(e.target.value) })}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 -rotate-90 ${band.accent} bg-slate-800 rounded-full appearance-none`}
                  style={{
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)"
                  }}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 leading-tight">
                  {band.label.split(" ")[0]}
                  <br/>
                  <span className="text-white/40">{band.label.split(" ")[1]} {band.label.split(" ")[2]}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
