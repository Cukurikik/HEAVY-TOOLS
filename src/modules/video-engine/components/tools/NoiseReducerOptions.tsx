"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Noise Reducer — Configuration Panel
 * Kurangi noise visual via hqdn3d
 */
export function NoiseReducerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Strength</Label><span className="text-slate-400 font-black">{(task.options?.strength as string)||"7"}</span></div><div className="grid grid-cols-3 gap-2">{["3","5","7","10","15","20"].map((s)=>(<button key={s} onClick={()=>setOptions({strength:s})} className={`py-3 rounded-xl border text-xs font-bold transition-all ${(task.options?.strength||"7")===s?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{s}</button>))}</div></div>
  );
}
