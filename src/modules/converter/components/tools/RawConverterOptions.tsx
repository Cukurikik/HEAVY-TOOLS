"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function RawConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Image Format</label>
        <select
          value={(opts.format as string) || "image/jpeg"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
        >
          <option value="image/jpeg">JPEG (.jpg)</option>
          <option value="image/png">PNG (.png)</option>
          <option value="image/tiff">TIFF (.tiff)</option>
        </select>
      </div>
      
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-200/60 font-medium">
          CR2, NEF, ARW, and other RAW images are converted via our extreme performance server utilizing LibRaw/ImageMagick to ensure pixel-perfect color rendition.
        </p>
      </div>
    </div>
  );
}
