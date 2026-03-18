"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Frame Interpolator — Configuration Panel
 * Tingkatkan FPS via minterpolate
 */
export function FrameInterpolatorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Target FPS</Label><span className="text-fuchsia-400 font-black text-lg">{(task.options?.fps as number)||60}</span></div><div className="grid grid-cols-4 gap-2">{[30,60,90,120].map((f)=>(<button key={f} onClick={()=>setOptions({fps:f})} className={`py-3 rounded-xl border text-xs font-bold transition-all ${(task.options?.fps||60)===f?"bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-fuchsia-500/10"}`}>{f} FPS</button>))}</div></div>
  );
}
