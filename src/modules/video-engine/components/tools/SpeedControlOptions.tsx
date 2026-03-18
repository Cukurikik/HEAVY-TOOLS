"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Speed Controller — Configuration Panel
 * Ubah kecepatan 0.25x–4x
 */
export function SpeedControlOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Speed</Label><span className="text-indigo-400 font-black text-lg">{(task.options?.speed as number)||1}x</span></div><div className="grid grid-cols-4 gap-2">{[0.25,0.5,1.0,1.5,2.0,3.0,4.0].map((s)=>(<button key={s} onClick={()=>setOptions({speed:s})} className={`py-3 rounded-xl border text-xs font-bold transition-all ${(task.options?.speed||1)===s?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{s}x</button>))}</div></div>
  );
}
