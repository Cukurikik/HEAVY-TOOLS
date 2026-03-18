"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Timelapse Maker — Configuration Panel
 * Buat timelapse skip-frame
 */
export function TimelapseOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Speed</Label><span className="text-green-400 font-black text-lg">{(task.options?.speed as number)||10}x</span></div><div className="grid grid-cols-4 gap-2">{[5,10,20,50,100].map((s)=>(<button key={s} onClick={()=>setOptions({speed:s})} className={`py-3 rounded-xl border text-xs font-bold transition-all ${(task.options?.speed||10)===s?"bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-green-500/10"}`}>{s}x</button>))}</div></div>
  );
}
