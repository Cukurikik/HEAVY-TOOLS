"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Loop Engine — Configuration Panel
 * Buat video loop kustom
 */
export function LoopEngineOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Loop Count</Label><span className="text-pink-400 font-black text-lg">{(task.options?.loops as number)||3}x</span></div><Slider defaultValue={[3]} min={2} max={20} step={1} onValueChange={(val)=>setOptions({loops:val[0]})} /><div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold"><span>2 loops</span><span>20 loops</span></div></div>
  );
}
