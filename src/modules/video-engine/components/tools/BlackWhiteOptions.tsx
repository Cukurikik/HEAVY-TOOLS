"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Black & White — Configuration Panel
 * Grayscale with intensity, contrast, and sepia controls
 */
export function BlackWhiteOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Desaturation</Label>
          <span className="text-gray-300 font-black text-lg">{(task.options?.intensity as number) ?? 0}</span>
        </div>
        <Slider defaultValue={[0]} min={0} max={1} step={0.1} onValueChange={(val) => setOptions({ intensity: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Full B&W</span>
          <span>Original Color</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Contrast Boost</Label>
          <span className="text-gray-300 font-black text-lg">{((task.options?.contrast as number) ?? 1).toFixed(1)}</span>
        </div>
        <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} onValueChange={(val) => setOptions({ contrast: val[0] })} />
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <div className="space-y-1">
          <Label className="text-amber-300 text-xs font-bold uppercase tracking-widest">Sepia Tone</Label>
          <p className="text-amber-400/50 text-[10px] font-medium">Warm vintage color grading</p>
        </div>
        <Switch
          checked={(task.options?.sepia as boolean) ?? false}
          onCheckedChange={(checked: boolean) => setOptions({ sepia: checked })}
        />
      </div>
    </div>
  );
}
