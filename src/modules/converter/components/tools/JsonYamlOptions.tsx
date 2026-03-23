"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function JsonYamlOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Conversion Direction</label>
        <select
          value={(opts.direction as string) || "json-to-yaml"}
          onChange={(e) => setOptions({ direction: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
        >
          <option value="json-to-yaml">JSON to YAML</option>
          <option value="yaml-to-json">YAML to JSON</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Direct Input (Optional)</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="Paste your code here... or upload a file on the left."
          className="w-full h-40 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-cyan-500 outline-none resize-y"
        />
        <p className="text-xs text-slate-500">If a file is uploaded, this text box is ignored.</p>
      </div>
    </div>
  );
}
