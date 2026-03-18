"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Color Grader — Configuration Panel
 * Brightness, contrast, saturation, hue
 */
export function ColorGraderOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">{[{key:"brightness",label:"Brightness",min:-1,max:1,step:0.05,def:0},{key:"contrast",label:"Contrast",min:0,max:3,step:0.1,def:1},{key:"saturation",label:"Saturation",min:0,max:3,step:0.1,def:1},{key:"hue",label:"Hue",min:0,max:360,step:1,def:0}].map((c)=>(<div key={c.key} className="space-y-3"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">{c.label}</Label><span className="text-rose-400 font-black">{(task.options?.[c.key] as number)??c.def}</span></div><Slider defaultValue={[c.def]} min={c.min} max={c.max} step={c.step} onValueChange={(val)=>setOptions({[c.key]:val[0]})} /></div>))}</div>
  );
}
