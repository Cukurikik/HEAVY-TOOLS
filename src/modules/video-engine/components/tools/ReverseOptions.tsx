"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Video Reverser — Configuration Panel
 * Balik video frame-by-frame with audio control
 */
export function ReverseOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
        <div className="space-y-1">
          <Label className="text-purple-300 text-xs font-bold uppercase tracking-widest">Reverse Audio</Label>
          <p className="text-purple-400/50 text-[10px] font-medium">Also reverses the audio track</p>
        </div>
        <Switch
          checked={(task.options?.reverseAudio as boolean) ?? true}
          onCheckedChange={(checked: boolean) => setOptions({ reverseAudio: checked })}
        />
      </div>
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 text-center">
        <p className="text-slate-400 text-xs font-medium">⚡ Reverses all frames in memory. Best for clips under 60 seconds.</p>
      </div>
    </div>
  );
}
