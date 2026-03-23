"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

/**
 * Video Flipper — Configuration Panel
 * Flip horizontal/vertical/both
 */
export function FlipperOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Direction</Label>
        <Select defaultValue="horizontal" onValueChange={(val) => setOptions({ direction: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="horizontal">↔ Horizontal (Mirror)</SelectItem>
            <SelectItem value="vertical">↕ Vertical (Upside Down)</SelectItem>
            <SelectItem value="both">⤡ Both Axes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
