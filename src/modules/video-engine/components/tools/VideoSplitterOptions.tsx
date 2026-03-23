"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Video Splitter — Configuration Panel
 * Split video by time or segment count
 */
export function VideoSplitterOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Segment Duration (sec)</Label>
          <span className="text-emerald-400 font-black text-lg">{(task.options?.segmentDuration as number) || 30}s</span>
        </div>
        <Slider defaultValue={[30]} min={5} max={300} step={5} onValueChange={(val) => setOptions({ segmentDuration: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>5 sec</span>
          <span>5 min</span>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
        <p className="text-emerald-400 text-xs font-medium">📦 First segment will be returned as output. All segments saved in WASM FS.</p>
      </div>
    </div>
  );
}
