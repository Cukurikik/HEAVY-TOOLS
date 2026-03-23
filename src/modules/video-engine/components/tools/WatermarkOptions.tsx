"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Watermark — Configuration Panel
 * Text watermark with position, size, opacity
 */
export function WatermarkOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Watermark Text</Label>
        <Input type="text" defaultValue="HEAVY-TOOLS" className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ text: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Position</Label>
        <Select defaultValue="bottom-right" onValueChange={(val) => setOptions({ position: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Font Size</Label>
          <span className="text-blue-400 font-black text-lg">{(task.options?.fontSize as number) || 24}</span>
        </div>
        <Slider defaultValue={[24]} min={12} max={72} step={2} onValueChange={(val) => setOptions({ fontSize: val[0] })} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Opacity</Label>
          <span className="text-blue-400 font-black text-lg">{((task.options?.opacity as number) ?? 0.7).toFixed(1)}</span>
        </div>
        <Slider defaultValue={[0.7]} min={0.1} max={1} step={0.1} onValueChange={(val) => setOptions({ opacity: val[0] })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Font Color</Label>
        <Select defaultValue="white" onValueChange={(val) => setOptions({ fontColor: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="red">Red</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
