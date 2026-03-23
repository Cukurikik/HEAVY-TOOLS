"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Color Grader — Configuration Panel
 * Brightness, contrast, saturation, hue, gamma
 */
export function ColorGraderOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Brightness</Label>
          <span className="text-amber-400 font-black text-sm">{((task.options?.brightness as number) ?? 0).toFixed(2)}</span>
        </div>
        <Slider defaultValue={[0]} min={-0.5} max={0.5} step={0.05} onValueChange={(val) => setOptions({ brightness: val[0] })} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Contrast</Label>
          <span className="text-amber-400 font-black text-sm">{((task.options?.contrast as number) ?? 1).toFixed(1)}</span>
        </div>
        <Slider defaultValue={[1]} min={0.2} max={3} step={0.1} onValueChange={(val) => setOptions({ contrast: val[0] })} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Saturation</Label>
          <span className="text-amber-400 font-black text-sm">{((task.options?.saturation as number) ?? 1).toFixed(1)}</span>
        </div>
        <Slider defaultValue={[1]} min={0} max={3} step={0.1} onValueChange={(val) => setOptions({ saturation: val[0] })} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Hue Shift</Label>
          <span className="text-amber-400 font-black text-sm">{(task.options?.hue as number) ?? 0}°</span>
        </div>
        <Slider defaultValue={[0]} min={-180} max={180} step={5} onValueChange={(val) => setOptions({ hue: val[0] })} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Gamma</Label>
          <span className="text-amber-400 font-black text-sm">{((task.options?.gamma as number) ?? 1).toFixed(1)}</span>
        </div>
        <Slider defaultValue={[1]} min={0.1} max={3} step={0.1} onValueChange={(val) => setOptions({ gamma: val[0] })} />
      </div>
    </div>
  );
}
