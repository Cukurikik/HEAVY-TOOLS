"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * HDR Tonemapper — Configuration Panel
 * HDR to SDR conversion with algorithm and desaturation controls
 */
export function HdrTonemapperOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Tonemap Algorithm</Label>
        <Select defaultValue="hable" onValueChange={(val) => setOptions({ algorithm: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="hable">Hable (Uncharted 2)</SelectItem>
            <SelectItem value="reinhard">Reinhard</SelectItem>
            <SelectItem value="mobius">Möbius</SelectItem>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="clip">Clip</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Desaturation</Label>
          <span className="text-orange-400 font-black text-lg">{((task.options?.desaturation as number) ?? 0).toFixed(1)}</span>
        </div>
        <Slider defaultValue={[0]} min={0} max={1} step={0.1} onValueChange={(val) => setOptions({ desaturation: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Vibrant</span>
          <span>Muted</span>
        </div>
      </div>
    </div>
  );
}
