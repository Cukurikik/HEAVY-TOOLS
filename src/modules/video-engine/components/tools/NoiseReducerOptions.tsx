"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Noise Reducer — Configuration Panel
 * hqdn3d filter with spatial and temporal controls
 */
export function NoiseReducerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Spatial Strength</Label>
          <span className="text-teal-400 font-black text-lg">{(task.options?.spatial as number) || 4}</span>
        </div>
        <Slider defaultValue={[4]} min={0} max={20} step={1} onValueChange={(val) => setOptions({ spatial: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Natural</span>
          <span>Heavy Denoise</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Temporal Strength</Label>
          <span className="text-teal-400 font-black text-lg">{(task.options?.temporal as number) || 6}</span>
        </div>
        <Slider defaultValue={[6]} min={0} max={20} step={1} onValueChange={(val) => setOptions({ temporal: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Minimal</span>
          <span>Aggressive</span>
        </div>
      </div>
    </div>
  );
}
