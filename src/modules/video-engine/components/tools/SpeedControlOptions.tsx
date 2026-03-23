"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Speed Controller — Configuration Panel
 * Ubah kecepatan 0.25x–4x with audio controls
 */
export function SpeedControlOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Speed</Label>
          <span className="text-emerald-400 font-black text-lg">{((task.options?.speed as number) || 1).toFixed(2)}x</span>
        </div>
        <Slider defaultValue={[1]} min={0.25} max={4} step={0.25} onValueChange={(val) => setOptions({ speed: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>0.25x Slow</span>
          <span>4x Fast</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <div className="space-y-1">
          <Label className="text-blue-300 text-xs font-bold uppercase tracking-widest">Keep Audio</Label>
          <p className="text-blue-400/50 text-[10px] font-medium">Preserve + adjust audio with tempo filter</p>
        </div>
        <Switch
          defaultChecked={true}
          onCheckedChange={(checked: boolean) => setOptions({ keepAudio: checked })}
        />
      </div>
    </div>
  );
}
