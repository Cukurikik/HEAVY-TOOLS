"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Loop Engine — Configuration Panel
 * Buat looping dengan konfigurasi jumlah putaran
 */
export function LoopEngineOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Loop Count</Label>
          <span className="text-purple-400 font-black text-lg">{(task.options?.loops as number) || 3}x</span>
        </div>
        <Slider defaultValue={[3]} min={2} max={20} step={1} onValueChange={(val) => setOptions({ loops: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>2x</span>
          <span>20x</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
        <div className="space-y-1">
          <Label className="text-violet-300 text-xs font-bold uppercase tracking-widest">Infinite GIF Loop</Label>
          <p className="text-violet-400/50 text-[10px] font-medium">Outputs as repeating GIF instead of MP4</p>
        </div>
        <Switch
          checked={(task.options?.infiniteGif as boolean) ?? false}
          onCheckedChange={(checked: boolean) => setOptions({ infiniteGif: checked })}
        />
      </div>
    </div>
  );
}
