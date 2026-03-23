"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function CsvJsonOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Conversion Direction</label>
        <select
          value={(opts.direction as string) || "csv-to-json"}
          onChange={(e) => setOptions({ direction: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
        >
          <option value="csv-to-json">CSV to JSON Array</option>
          <option value="json-to-csv">JSON Array to CSV</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Direct Input (Optional)</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="Paste your CSV or JSON here..."
          className="w-full h-40 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-emerald-500 outline-none resize-y"
        />
      </div>
    </div>
  );
}
