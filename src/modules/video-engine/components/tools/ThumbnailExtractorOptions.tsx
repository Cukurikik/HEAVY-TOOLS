"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

/**
 * Thumbnail Extractor — Configuration Panel
 * Extract frame as image with format + quality controls
 */
export function ThumbnailExtractorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Timestamp</Label>
        <Input type="text" defaultValue="00:00:01" placeholder="HH:MM:SS" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e) => setOptions({ timestamp: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Image Format</Label>
        <Select defaultValue="png" onValueChange={(val) => setOptions({ imageFormat: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="png">PNG (Lossless)</SelectItem>
            <SelectItem value="jpg">JPEG (Smaller)</SelectItem>
            <SelectItem value="bmp">BMP (Raw)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(task.options?.imageFormat === "jpg") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">JPEG Quality</Label>
            <span className="text-amber-400 font-black text-lg">{(task.options?.quality as number) || 2}</span>
          </div>
          <Slider defaultValue={[2]} min={1} max={31} step={1} onValueChange={(val) => setOptions({ quality: val[0] })} />
          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            <span>Best</span>
            <span>Smallest</span>
          </div>
        </div>
      )}
    </div>
  );
}
