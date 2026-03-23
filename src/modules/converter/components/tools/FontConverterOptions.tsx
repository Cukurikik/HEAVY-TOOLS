"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function FontConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Font Format</label>
        <select
          value={(opts.format as string) || "woff2"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
        >
          <option value="woff2">WOFF2 (Modern Web Fastest)</option>
          <option value="woff">WOFF (Legacy Web Support)</option>
          <option value="ttf">TTF (TrueType / OS Installable)</option>
          <option value="otf">OTF (OpenType Advanced Print)</option>
        </select>
      </div>
    </div>
  );
}
