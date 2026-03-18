"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Video Splitter — Configuration Panel
 * Pecah video berdasarkan waktu
 */
export function VideoSplitterOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Segment (sec)</Label><span className="text-sky-400 font-black text-lg">{(task.options?.segmentDuration as number)||30}s</span></div><Slider defaultValue={[30]} min={5} max={300} step={5} onValueChange={(val)=>setOptions({segmentDuration:val[0]})} /><div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold"><span>5s</span><span>5min</span></div></div>
  );
}
