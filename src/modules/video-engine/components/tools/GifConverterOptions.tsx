"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * GIF Converter — Configuration Panel
 * Konversi video ke GIF
 */
export function GifConverterOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5"><div className="space-y-3"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">FPS</Label><span className="text-lime-400 font-black">{(task.options?.fps as number)||10}</span></div><Slider defaultValue={[10]} min={5} max={30} step={1} onValueChange={(val)=>setOptions({fps:val[0]})} /></div><div className="space-y-3"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Width</Label><span className="text-lime-400 font-black">{(task.options?.scale as number)||480}px</span></div><Slider defaultValue={[480]} min={200} max={800} step={20} onValueChange={(val)=>setOptions({scale:val[0]})} /></div></div>
  );
}
