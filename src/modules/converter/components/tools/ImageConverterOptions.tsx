"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function ImageConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Image Format</label>
        <select
          value={(opts.format as string) || "image/png"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
        >
          <option value="image/png">PNG (Lossless, Transparent)</option>
          <option value="image/jpeg">JPEG (Compressed, Standard)</option>
          <option value="image/webp">WebP (Next-Gen Compression)</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-slate-400">Compression Quality</label>
          <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-1 rounded">
            {((opts.quality as number) ?? 0.9) * 100}%
          </span>
        </div>
        <input
          type="range"
          min="0.1" max="1" step="0.1"
          value={(opts.quality as number) ?? 0.9}
          onChange={(e) => setOptions({ quality: parseFloat(e.target.value) })}
          className="w-full accent-blue-500"
        />
        <p className="text-xs text-slate-500 mt-2">
          Quality only applies to JPEG and WebP formats. PNG is always lossless.
        </p>
      </div>
    </div>
  );
}
