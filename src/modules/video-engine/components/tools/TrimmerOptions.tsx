"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Video Trimmer — Configuration Panel
 * Potong video presisi frame with codec selection
 */
export function TrimmerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Start Time</Label>
          <Input type="text" defaultValue="00:00:00" placeholder="HH:MM:SS" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e) => setOptions({ start: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">End Time</Label>
          <Input type="text" defaultValue="00:00:10" placeholder="HH:MM:SS" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e) => setOptions({ end: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Codec</Label>
        <Select defaultValue="reencode" onValueChange={(val) => setOptions({ codec: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="reencode">Re-encode (H.264) — Precise</SelectItem>
            <SelectItem value="copy">Stream Copy — Instant</SelectItem>
          </SelectContent>
        </Select>
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
    </div>
  );
}
