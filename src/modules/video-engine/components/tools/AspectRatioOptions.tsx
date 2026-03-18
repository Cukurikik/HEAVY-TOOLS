"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Aspect Ratio Tool — Configuration Panel
 * Ubah aspect ratio crop/letterbox
 */
export function AspectRatioOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="space-y-3"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Ratio</Label><div className="grid grid-cols-2 gap-2">{["16:9","4:3","1:1","9:16"].map((r)=>(<button key={r} onClick={()=>setOptions({ratio:r})} className={`py-4 rounded-xl border text-sm font-bold transition-all ${(task.options?.ratio||"16:9")===r?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{r}</button>))}</div></div><div className="space-y-3"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Mode</Label><div className="grid grid-cols-2 gap-2">{[{v:"crop",l:"✂ Crop"},{v:"letterbox",l:"📐 Letterbox"}].map((m)=>(<button key={m.v} onClick={()=>setOptions({mode:m.v})} className={`py-3 rounded-xl border text-xs font-bold transition-all ${(task.options?.mode||"crop")===m.v?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{m.l}</button>))}</div></div></div>
  );
}
