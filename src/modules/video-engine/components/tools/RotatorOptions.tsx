"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Video Rotator — Configuration Panel
 * Rotasi 90°/180°/270°
 */
export function RotatorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Rotation Angle</Label><div className="grid grid-cols-3 gap-2">{["90","180","270"].map((d)=>(<button key={d} onClick={()=>setOptions({degrees:d})} className={`py-4 rounded-xl border text-sm font-bold transition-all ${(task.options?.degrees||"90")===d?"bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{d}°</button>))}</div></div>
  );
}
