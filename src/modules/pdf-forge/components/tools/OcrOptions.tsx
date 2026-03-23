"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function OcrOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
        <h4 className="text-green-400 font-bold mb-1">Optical Character Recognition</h4>
        <p className="text-xs text-green-200/60 leading-relaxed font-medium">
          Extracts raw text from scanned image PDFs and embeds it as a searchable, highlightable invisible layer natively inside the PDF file.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Document Language</label>
        <select
          value={(opts.language as string) || "eng"}
          onChange={(e) => setOptions({ language: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
        >
          <option value="eng">English</option>
          <option value="ind">Indonesian</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
        </select>
      </div>
    </div>
  );
}
