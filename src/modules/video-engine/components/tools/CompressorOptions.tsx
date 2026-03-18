"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Video Compressor — Configuration Panel
 * Kompresi dengan kontrol CRF dan Bitrate
 */
export function CompressorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6"><div className="space-y-4"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">CRF Level</Label><span className="text-indigo-400 font-black text-lg">{(task.options?.crf as number) || 28}</span></div><Slider defaultValue={[28]} min={18} max={51} step={1} onValueChange={(val) => setOptions({ crf: val[0] })} /><div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold"><span>High Quality</span><span>Small File</span></div></div><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Preset</Label><Select defaultValue="medium" onValueChange={(val) => setOptions({ preset: val })}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="ultrafast">Ultrafast</SelectItem><SelectItem value="fast">Fast</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="slow">Slow</SelectItem><SelectItem value="veryslow">Very Slow</SelectItem></SelectContent></Select></div></div>
  );
}
