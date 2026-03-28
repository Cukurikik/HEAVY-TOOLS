"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * GIF Converter — Configuration Panel
 * Video ke GIF berkualitas tinggi
 */
export function GifConverterOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">FPS</Label>
          <span className="text-pink-400 font-black text-lg">{(task.options?.fps as number) || 10}</span>
        </div>
        <Slider defaultValue={[10]} min={5} max={30} step={1} onValueChange={(val) => setOptions({ fps: val[0] })} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Width (px)</Label>
          <span className="text-pink-400 font-black text-lg">{(task.options?.scale as number) || 480}</span>
        </div>
        <Slider defaultValue={[480]} min={120} max={1080} step={10} onValueChange={(val) => setOptions({ scale: val[0] })} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Max Colors</Label>
          <span className="text-pink-400 font-black text-lg">{(task.options?.maxColors as number) || 256}</span>
        </div>
        <Slider defaultValue={[256]} min={16} max={256} step={16} onValueChange={(val) => setOptions({ maxColors: val[0] })} />
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
        <div className="space-y-1">
          <Label className="text-pink-300 text-xs font-bold uppercase tracking-widest">Dithering</Label>
          <p className="text-pink-400/50 text-[10px] font-medium">Reduces color banding artifacts</p>
        </div>
        <Switch
          checked={(task.options?.dither as boolean) ?? true}
          onCheckedChange={(checked: boolean) => setOptions({ dither: checked })}
        />
      </div>
    </div>
  );
}
