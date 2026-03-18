"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Slow Motion — Configuration Panel
 * Slow motion hingga 0.1x
 */
export function SlowMotionOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Factor</Label><span className="text-blue-400 font-black text-lg">{(task.options?.factor as number)||0.5}x</span></div><div className="grid grid-cols-4 gap-2">{[0.1,0.25,0.5,0.75].map((f)=>(<button key={f} onClick={()=>setOptions({factor:f})} className={`py-3 rounded-xl border text-xs font-bold transition-all ${(task.options?.factor||0.5)===f?"bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-blue-500/10"}`}>{f}x</button>))}</div></div>
  );
}
