"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";

/**
 * Chapter Marker — Configuration Panel
 * Tambah chapter markers
 */
export function ChapterMarkerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Chapters</Label><textarea defaultValue={"00:00:00=Intro\n00:01:00=Chapter 1\n00:05:00=Chapter 2"} className="w-full h-32 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="HH:MM:SS=Title" onChange={(e)=>setOptions({chapters:e.target.value})} /></div><div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/70 text-[10px] font-bold text-center uppercase tracking-widest">Format: HH:MM:SS=Title</div></div>
  );
}
