"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function CompressorOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Compression Level</label>
        <select
          value={(opts.level as string) || "recommended"}
          onChange={(e) => setOptions({ level: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
        >
          <option value="extreme">Extreme (Smallest size, lower quality)</option>
          <option value="recommended">Recommended (Good balance)</option>
          <option value="low">Low (Large size, high quality)</option>
        </select>
        <p className="text-xs text-slate-500 mt-2">
          Reduces file size by decreasing image resolution and optimizing metadata.
        </p>
      </div>
    </div>
  );
}
