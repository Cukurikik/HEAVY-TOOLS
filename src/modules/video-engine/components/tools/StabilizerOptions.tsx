"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Video Stabilizer — Configuration Panel
 * Stabilisasi video dengan deshake filter + configurable params
 */
export function StabilizerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Shakiness Level</Label>
          <span className="text-cyan-400 font-black text-lg">{(task.options?.shakiness as number) || 5}</span>
        </div>
        <Slider defaultValue={[5]} min={1} max={10} step={1} onValueChange={(val) => setOptions({ shakiness: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Mild</span>
          <span>Heavy Shake</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Accuracy</Label>
          <span className="text-cyan-400 font-black text-lg">{(task.options?.accuracy as number) || 9}</span>
        </div>
        <Slider defaultValue={[9]} min={1} max={15} step={1} onValueChange={(val) => setOptions({ accuracy: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Fast</span>
          <span>Precise</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Smoothing</Label>
          <span className="text-cyan-400 font-black text-lg">{(task.options?.smoothing as number) || 10}</span>
        </div>
        <Slider defaultValue={[10]} min={1} max={30} step={1} onValueChange={(val) => setOptions({ smoothing: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Responsive</span>
          <span>Cinematic</span>
        </div>
      </div>
    </div>
  );
}
