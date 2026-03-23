"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function VectorConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Vector Format</label>
        <select
          value={(opts.format as string) || "eps"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none"
        >
          <option value="eps">EPS (Encapsulated PostScript / Print)</option>
          <option value="pdf">PDF (Vector Locked Format)</option>
          <option value="svg">SVG (Web Vector Markup)</option>
        </select>
      </div>
    </div>
  );
}
