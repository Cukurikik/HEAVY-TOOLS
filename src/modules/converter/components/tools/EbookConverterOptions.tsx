"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function EbookConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target E-Reader Format</label>
        <select
          value={(opts.format as string) || "epub"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
        >
          <option value="epub">EPUB (Universal E-Reader)</option>
          <option value="mobi">MOBI (Legacy Kindle)</option>
          <option value="azw3">AZW3 (Modern Kindle)</option>
          <option value="pdf">PDF (Printable)</option>
        </select>
      </div>
    </div>
  );
}
