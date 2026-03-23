"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Frame Interpolator — Configuration Panel
 * Tingkatkan FPS via minterpolate filter
 */
export function FrameInterpolatorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Target FPS</Label>
          <span className="text-sky-400 font-black text-lg">{(task.options?.fps as number) || 60}</span>
        </div>
        <Slider defaultValue={[60]} min={24} max={120} step={1} onValueChange={(val) => setOptions({ fps: val[0] })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Motion Estimation</Label>
        <Select defaultValue="mci" onValueChange={(val) => setOptions({ meMode: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="mci">MCI (Best Quality)</SelectItem>
            <SelectItem value="blend">Blend (Fast)</SelectItem>
            <SelectItem value="dup">Duplicate (Fastest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
