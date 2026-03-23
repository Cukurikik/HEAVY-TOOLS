"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Subtitle Burner — Configuration Panel
 * Burn SRT subtitles with style controls
 */
export function SubtitleBurnerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Subtitle Text</Label>
        <Input type="text" defaultValue="Sample Subtitle" className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ subtitleText: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Start</Label>
          <Input type="text" defaultValue="00:00:00,000" placeholder="HH:MM:SS,mmm" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e) => setOptions({ subStart: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">End</Label>
          <Input type="text" defaultValue="00:00:10,000" placeholder="HH:MM:SS,mmm" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e) => setOptions({ subEnd: e.target.value })} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Font Size</Label>
          <span className="text-yellow-400 font-black text-lg">{(task.options?.fontSize as number) || 24}</span>
        </div>
        <Slider defaultValue={[24]} min={12} max={72} step={2} onValueChange={(val) => setOptions({ fontSize: val[0] })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Font Color</Label>
        <Select defaultValue="white" onValueChange={(val) => setOptions({ fontColor: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="cyan">Cyan</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="green">Green</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
