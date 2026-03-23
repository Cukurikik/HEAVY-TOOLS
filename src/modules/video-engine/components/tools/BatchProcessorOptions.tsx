"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Batch Processor — Configuration Panel
 * Multi-file operations with quality control
 */
export function BatchProcessorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 text-orange-400 text-xs font-bold text-center">
        Upload multiple video files. Each will be processed with the selected operation.
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Operation</Label>
        <Select defaultValue="compress" onValueChange={(val) => setOptions({ batchOperation: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="compress">Compress (H.264)</SelectItem>
            <SelectItem value="grayscale">Grayscale</SelectItem>
            <SelectItem value="resize720">Resize → 720p</SelectItem>
            <SelectItem value="resize480">Resize → 480p</SelectItem>
            <SelectItem value="rotate90">Rotate 90° CW</SelectItem>
            <SelectItem value="flipH">Flip Horizontal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(task.options?.batchOperation === "compress" || !task.options?.batchOperation) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Quality (CRF)</Label>
            <span className="text-orange-400 font-black text-lg">{(task.options?.batchCrf as number) || 28}</span>
          </div>
          <Slider defaultValue={[28]} min={18} max={45} step={1} onValueChange={(val) => setOptions({ batchCrf: val[0] })} />
          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            <span>High Quality</span>
            <span>Small File</span>
          </div>
        </div>
      )}
    </div>
  );
}
