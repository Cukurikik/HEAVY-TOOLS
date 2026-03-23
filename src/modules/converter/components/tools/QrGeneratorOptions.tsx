"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function QrGeneratorOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Content / Data</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="Enter a URL, contact info, or secret text payload..."
          className="w-full h-32 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-indigo-500 outline-none resize-y"
        />
      </div>

      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-xs text-indigo-200/60 font-medium">
          QR codes are rendered dynamically as high-resolution (500x500 px) transparent PNGs ready for digital or print assets. Note that dropping a file here will be ignored.
        </p>
      </div>
    </div>
  );
}
