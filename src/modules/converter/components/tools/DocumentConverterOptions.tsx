"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function DocumentConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Document Type</label>
        <select
          value={(opts.format as string) || "pdf"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
        >
          <option value="pdf">PDF (Print & read-only)</option>
          <option value="docx">Word (.docx)</option>
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="pptx">PowerPoint (.pptx)</option>
          <option value="txt">Plain Text (.txt)</option>
        </select>
      </div>
      
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
          Powered by the heavy LibreOffice conversion engine running securely on our server. Layouts, margins, and complex tables are preserved with extreme accuracy.
        </p>
      </div>
    </div>
  );
}
