"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Video Flipper — Configuration Panel
 * Flip horizontal/vertical
 */
export function FlipperOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Flip Direction</Label><div className="grid grid-cols-2 gap-3">{[{value:"horizontal",label:"↔ Horizontal"},{value:"vertical",label:"↕ Vertical"}].map((d)=>(<button key={d.value} onClick={()=>setOptions({direction:d.value})} className={`py-4 rounded-xl border text-sm font-bold transition-all ${(task.options?.direction||"horizontal")===d.value?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{d.label}</button>))}</div></div>
  );
}
