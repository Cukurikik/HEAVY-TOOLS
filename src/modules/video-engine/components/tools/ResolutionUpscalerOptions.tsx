"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Resolution Upscaler — Configuration Panel
 * Scale with algorithm presets and target resolution
 */
export function ResolutionUpscalerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Scale Factor</Label>
          <span className="text-rose-400 font-black text-lg">{(task.options?.scale as number) || 2}x</span>
        </div>
        <Slider defaultValue={[2]} min={1} max={4} step={1} onValueChange={(val) => setOptions({ scale: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>1x (Original)</span>
          <span>4x</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Algorithm</Label>
        <Select defaultValue="lanczos" onValueChange={(val) => setOptions({ algorithm: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="lanczos">Lanczos (Best Quality)</SelectItem>
            <SelectItem value="bicubic">Bicubic (Balanced)</SelectItem>
            <SelectItem value="bilinear">Bilinear (Fast)</SelectItem>
            <SelectItem value="neighbor">Nearest Neighbor (Pixel Art)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Target Resolution</Label>
        <Select defaultValue="auto" onValueChange={(val) => setOptions({ targetRes: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="auto">Auto (Scale Factor)</SelectItem>
            <SelectItem value="3840:2160">4K (3840×2160)</SelectItem>
            <SelectItem value="2560:1440">2K (2560×1440)</SelectItem>
            <SelectItem value="1920:1080">1080p</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
