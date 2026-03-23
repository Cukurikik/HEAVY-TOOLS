"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/**
 * Video Rotator — Configuration Panel
 * Rotasi 90°/180°/270° or custom angle
 */
export function RotatorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Rotation</Label>
        <Select defaultValue="90" onValueChange={(val) => setOptions({ degrees: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="90">90° Clockwise</SelectItem>
            <SelectItem value="180">180°</SelectItem>
            <SelectItem value="270">270° (90° Counter-CW)</SelectItem>
            <SelectItem value="custom">Custom Angle</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(task.options?.degrees === "custom") && (
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Custom Angle (degrees)</Label>
          <Input
            type="number"
            placeholder="e.g. 45"
            className="bg-slate-800 border-slate-700 text-white font-mono"
            onChange={(e) => setOptions({ customAngle: parseFloat(e.target.value) })}
          />
        </div>
      )}
    </div>
  );
}
