"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function SplitterOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Page Range to Keep</label>
        <input
          type="text"
          placeholder="e.g. 1-3, 5, 8-10"
          value={(opts.pageRange as string) || "1"}
          onChange={(e) => setOptions({ pageRange: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none placeholder:text-slate-500"
        />
        <p className="text-xs text-slate-500 mt-2">
          Use hyphens for ranges and commas to separate them. Leaves intact pages and discards the rest.
        </p>
      </div>
    </div>
  );
}
