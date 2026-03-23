"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Slow Motion — Configuration Panel
 * Slow motion with interpolation
 */
export function SlowMotionOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Slow Factor</Label>
          <span className="text-violet-400 font-black text-lg">{((task.options?.factor as number) || 0.5).toFixed(2)}x</span>
        </div>
        <Slider defaultValue={[0.5]} min={0.1} max={0.9} step={0.05} onValueChange={(val) => setOptions({ factor: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Ultra Slow</span>
          <span>Near Normal</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
        <div className="space-y-1">
          <Label className="text-violet-300 text-xs font-bold uppercase tracking-widest">Smooth Interpolation</Label>
          <p className="text-violet-400/50 text-[10px] font-medium">Uses minterpolate for silky motion</p>
        </div>
        <Switch
          defaultChecked={true}
          onCheckedChange={(checked: boolean) => setOptions({ interpolate: checked })}
        />
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <div className="space-y-1">
          <Label className="text-blue-300 text-xs font-bold uppercase tracking-widest">Keep Audio</Label>
          <p className="text-blue-400/50 text-[10px] font-medium">Slow down audio with the video</p>
        </div>
        <Switch
          defaultChecked={false}
          onCheckedChange={(checked: boolean) => setOptions({ keepAudio: checked })}
        />
      </div>
    </div>
  );
}
