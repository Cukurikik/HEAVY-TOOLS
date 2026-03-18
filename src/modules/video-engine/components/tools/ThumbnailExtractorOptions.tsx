"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Thumbnail Extractor — Configuration Panel
 * Ekstrak frame sebagai gambar
 */
export function ThumbnailExtractorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Timestamp</Label><Input type="text" defaultValue="00:00:01" placeholder="HH:MM:SS" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e)=>setOptions({timestamp:e.target.value})} /></div><div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 text-teal-400/70 text-[10px] font-bold text-center uppercase tracking-widest">Output: High-quality JPEG</div></div>
  );
}
