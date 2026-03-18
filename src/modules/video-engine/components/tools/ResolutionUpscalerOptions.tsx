"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * AI Upscaler — Configuration Panel
 * Upscale resolusi via bicubic
 */
export function ResolutionUpscalerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Scale Factor</Label><div className="grid grid-cols-3 gap-2">{[2,3,4].map((s)=>(<button key={s} onClick={()=>setOptions({scale:s})} className={`py-4 rounded-xl border text-sm font-bold transition-all ${(task.options?.scale||2)===s?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{s}x</button>))}</div><div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-yellow-400/70 text-[10px] font-bold text-center uppercase tracking-widest">Bicubic interpolation</div></div>
  );
}
