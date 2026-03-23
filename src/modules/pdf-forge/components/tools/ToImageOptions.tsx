"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function ToImageOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Target Image Format</label>
          <select
            value={(opts.format as string) || "png"}
            onChange={(e) => setOptions({ format: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
          >
            <option value="png">PNG (Lossless, Transparent)</option>
            <option value="jpeg">JPEG (Compressed, Smaller Size)</option>
            <option value="webp">WebP (Next-Gen Compression)</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Render Quality (DPI)</label>
            <span className="text-purple-400 font-mono text-xs bg-purple-500/10 px-2 py-1 rounded">
              {(opts.dpi as number) ?? 300} DPI
            </span>
          </div>
          <input
            type="range"
            min="72" max="600" step="12"
            value={(opts.dpi as number) ?? 300}
            onChange={(e) => setOptions({ dpi: parseInt(e.target.value) })}
            className="w-full accent-purple-500"
          />
        </div>
      </div>
      
      <p className="text-xs text-slate-500">
        You will receive a ZIP file containing one image per PDF page.
      </p>
    </div>
  );
}
