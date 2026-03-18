"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Subtitle Burner — Configuration Panel
 * Burn subtitle SRT ke video
 */
export function SubtitleBurnerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Subtitle Text</Label><Input type="text" placeholder="Enter subtitle..." className="bg-slate-800 border-slate-700 text-white" onChange={(e)=>setOptions({subtitleText:e.target.value})} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Start</Label><Input type="text" defaultValue="00:00:00,000" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e)=>setOptions({subStart:e.target.value})} /></div><div className="space-y-2"><Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">End</Label><Input type="text" defaultValue="00:00:10,000" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e)=>setOptions({subEnd:e.target.value})} /></div></div></div>
  );
}
