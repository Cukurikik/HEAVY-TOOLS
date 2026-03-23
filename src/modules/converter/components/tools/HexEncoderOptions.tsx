"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function HexEncoderOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Operation</label>
        <select
          value={(opts.direction as string) || "encode"}
          onChange={(e) => setOptions({ direction: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
        >
          <option value="encode">Text to Hexadecimal</option>
          <option value="decode">Hexadecimal to Text</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">String Input</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="Paste string here..."
          className="w-full h-40 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-pink-500 outline-none resize-y"
        />
      </div>
    </div>
  );
}
