"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Batch Processor — Configuration Panel
 * Proses multiple video sekaligus
 */
export function BatchProcessorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Operation</Label><Select defaultValue="compress" onValueChange={(val)=>setOptions({batchOperation:val})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="compress">Compress (H.264)</SelectItem><SelectItem value="grayscale">Grayscale</SelectItem></SelectContent></Select></div><div className="space-y-3"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">CRF</Label><span className="text-purple-400 font-black">{(task.options?.batchCrf as number)||28}</span></div><Slider defaultValue={[28]} min={18} max={51} step={1} onValueChange={(val)=>setOptions({batchCrf:val[0]})} /></div></div>
  );
}
