"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

/**
 * Screen Recorder — Configuration Panel
 * Uses MediaRecorder API (no FFmpeg needed)
 */
export function ScreenRecorderOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Resolution</Label>
        <Select defaultValue="1080" onValueChange={(val) => setOptions({ resolution: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="720">720p</SelectItem>
            <SelectItem value="1080">1080p</SelectItem>
            <SelectItem value="1440">1440p</SelectItem>
            <SelectItem value="2160">4K</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Frame Rate</Label>
        <Select defaultValue="30" onValueChange={(val) => setOptions({ fps: parseInt(val) })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="24">24 FPS</SelectItem>
            <SelectItem value="30">30 FPS</SelectItem>
            <SelectItem value="60">60 FPS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
        <div className="space-y-1">
          <Label className="text-red-300 text-xs font-bold uppercase tracking-widest">System Audio</Label>
          <p className="text-red-400/50 text-[10px] font-medium">Capture system audio (if supported)</p>
        </div>
        <Switch
          defaultChecked={false}
          onCheckedChange={(checked: boolean) => setOptions({ systemAudio: checked })}
        />
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <div className="space-y-1">
          <Label className="text-blue-300 text-xs font-bold uppercase tracking-widest">Microphone</Label>
          <p className="text-blue-400/50 text-[10px] font-medium">Include microphone audio</p>
        </div>
        <Switch
          defaultChecked={false}
          onCheckedChange={(checked: boolean) => setOptions({ microphone: checked })}
        />
      </div>
    </div>
  );
}
