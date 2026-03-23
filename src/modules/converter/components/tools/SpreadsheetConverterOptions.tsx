"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function SpreadsheetConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Spreadsheet Format</label>
        <select
          value={(opts.format as string) || "csv"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
        >
          <option value="csv">CSV (Comma-Separated Values)</option>
          <option value="xlsx">XLSX (Microsoft Excel)</option>
          <option value="ods">ODS (OpenDocument Spreadsheet)</option>
        </select>
      </div>
    </div>
  );
}
