"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Video Merger — Configuration Panel
 * Gabungkan multiple video with re-encode and format options
 */
export function MergerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold text-center">
        Upload multiple video files. They will be concatenated in order.
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Output Format</Label>
        <Select defaultValue="mp4" onValueChange={(val) => setOptions({ format: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="mp4">MP4</SelectItem>
            <SelectItem value="mkv">MKV</SelectItem>
            <SelectItem value="webm">WebM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <div className="space-y-1">
          <Label className="text-amber-300 text-xs font-bold uppercase tracking-widest">Re-encode</Label>
          <p className="text-amber-400/50 text-[10px] font-medium">Enable if videos have different codecs/resolutions</p>
        </div>
        <Switch
          checked={(task.options?.reencode as boolean) ?? false}
          onCheckedChange={(checked: boolean) => setOptions({ reencode: checked })}
        />
      </div>
    </div>
  );
}
