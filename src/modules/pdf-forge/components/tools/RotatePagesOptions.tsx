"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function RotatePagesOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Rotation Angle</label>
        <select
          value={(opts.angle as number) || 90}
          onChange={(e) => setOptions({ angle: parseInt(e.target.value) })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
        >
          <option value={90}>Clockwise 90°</option>
          <option value={180}>Upside Down 180°</option>
          <option value={270}>Counter-Clockwise 270°</option>
        </select>
        <p className="text-xs text-slate-500 mt-2">
          Rotates every page in the document permanently. Perfect for fixing scanned documents.
        </p>
      </div>
    </div>
  );
}
