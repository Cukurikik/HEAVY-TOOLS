"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/**
 * Aspect Ratio — Configuration Panel
 * Crop or letterbox with custom ratio and color
 */
export function AspectRatioOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Aspect Ratio</Label>
        <Select defaultValue="16:9" onValueChange={(val) => setOptions({ ratio: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
            <SelectItem value="4:3">4:3 (Standard)</SelectItem>
            <SelectItem value="1:1">1:1 (Square)</SelectItem>
            <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
            <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(task.options?.ratio === "custom") && (
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Custom Ratio (W:H)</Label>
          <Input type="text" placeholder="e.g. 2.35:1" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e) => setOptions({ customRatio: e.target.value })} />
        </div>
      )}
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Mode</Label>
        <Select defaultValue="crop" onValueChange={(val) => setOptions({ mode: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="crop">Crop (Cut to fill)</SelectItem>
            <SelectItem value="letterbox">Letterbox (Add bars)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(task.options?.mode === "letterbox") && (
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Bar Color</Label>
          <Select defaultValue="black" onValueChange={(val) => setOptions({ barColor: val })}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="gray">Gray</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
