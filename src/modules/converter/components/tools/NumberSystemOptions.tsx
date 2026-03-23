"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function NumberSystemOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Input Base</label>
          <select
            value={(opts.inputBase as string) || "10"}
            onChange={(e) => setOptions({ inputBase: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
          >
            <option value="2">Binary (Base 2)</option>
            <option value="8">Octal (Base 8)</option>
            <option value="10">Decimal (Base 10)</option>
            <option value="16">Hexadecimal (Base 16)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Output Base</label>
          <select
            value={(opts.outputBase as string) || "2"}
            onChange={(e) => setOptions({ outputBase: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
          >
            <option value="2">Binary (Base 2)</option>
            <option value="8">Octal (Base 8)</option>
            <option value="10">Decimal (Base 10)</option>
            <option value="16">Hexadecimal (Base 16)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Numbers (Space separated)</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="e.g: 255 1024 10"
          className="w-full h-32 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-cyan-500 outline-none resize-y"
        />
      </div>
    </div>
  );
}
