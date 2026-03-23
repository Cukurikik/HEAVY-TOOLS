"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function VideoConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Video Format</label>
        <select
          value={(opts.format as string) || "mp4"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
        >
          <option value="mp4">MP4 (H.264 Universal)</option>
          <option value="webm">WebM (VP9 Highly Compressed)</option>
          <option value="gif">GIF (Animated image sequence)</option>
        </select>
      </div>
      
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Conversion happens entirely offline in your browser utilizing FFmpeg WASM. Faster devices will complete conversions significantly quicker.
        </p>
      </div>
    </div>
  );
}
