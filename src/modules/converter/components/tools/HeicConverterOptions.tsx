"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function HeicConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Image Format</label>
        <select
          value={(opts.format as string) || "image/jpeg"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500 outline-none"
        >
          <option value="image/jpeg">JPEG (Standard, High Compatibility)</option>
          <option value="image/png">PNG (Lossless, Larger file)</option>
          <option value="image/gif">GIF (For live photos)</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-slate-400">JPEG Quality</label>
          <span className="text-sky-400 font-mono text-xs bg-sky-500/10 px-2 py-1 rounded">
            {((opts.quality as number) ?? 0.8) * 100}%
          </span>
        </div>
        <input
          type="range"
          min="0.1" max="1" step="0.1"
          value={(opts.quality as number) ?? 0.8}
          onChange={(e) => setOptions({ quality: parseFloat(e.target.value) })}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-sky-200/60 mt-2">
          Quality slider only affects JPEG outputs. Runs fully natively in your browser.
        </p>
      </div>
    </div>
  );
}
