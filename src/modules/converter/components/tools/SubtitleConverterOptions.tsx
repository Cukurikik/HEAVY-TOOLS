"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function SubtitleConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Subtitle Format</label>
        <select
          value={(opts.format as string) || "vtt"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none"
        >
          <option value="vtt">WEBVTT (.vtt) - HTML5 Video Standard</option>
          <option value="srt">SubRip (.srt) - Traditional Software Standard</option>
        </select>
      </div>
      
      <p className="text-xs text-slate-500">Fast, local, string-based regex mapping algorithms format timings securely without exposing video metadata.</p>
    </div>
  );
}
