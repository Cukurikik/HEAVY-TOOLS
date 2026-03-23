"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function ConverterOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Format</label>
        <select
          value={(opts.format as string) || "docx"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none"
        >
          <option value="docx">Microsoft Word (.docx)</option>
          <option value="xlsx">Microsoft Excel (.xlsx)</option>
          <option value="pptx">Microsoft PowerPoint (.pptx)</option>
          <option value="odt">OpenDocument Text (.odt)</option>
        </select>
        <p className="text-xs text-lime-500/80 mt-2">
          Uses LibreOffice engine on the server to ensure maximum formatting retention.
        </p>
      </div>
    </div>
  );
}
