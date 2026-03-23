"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Timelapse — Configuration Panel
 * Create timelapse with speed + fps control
 */
export function TimelapseOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Speed Multiplier</Label>
          <span className="text-green-400 font-black text-lg">{(task.options?.speed as number) || 10}x</span>
        </div>
        <Slider defaultValue={[10]} min={2} max={60} step={1} onValueChange={(val) => setOptions({ speed: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>2x</span>
          <span>60x</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Output FPS</Label>
        <Select defaultValue="30" onValueChange={(val) => setOptions({ outputFps: parseInt(val) })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="24">24 FPS</SelectItem>
            <SelectItem value="30">30 FPS</SelectItem>
            <SelectItem value="60">60 FPS</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
