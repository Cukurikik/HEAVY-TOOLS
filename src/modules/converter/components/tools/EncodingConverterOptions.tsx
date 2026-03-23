"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function EncodingConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Encoding</label>
        <select
          value={(opts.encoding as string) || "utf-8"}
          onChange={(e) => setOptions({ encoding: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none"
        >
          <option value="utf-8">UTF-8 (Standard Modern Web)</option>
          <option value="windows-1252">Windows-1252 (ANSI/Legacy Windows)</option>
          <option value="iso-8859-1">ISO-8859-1 (Latin-1)</option>
          <option value="utf-16le">UTF-16 LE</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Raw Text Input (Ignored if file provided)</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="Type or paste standard text..."
          className="w-full h-32 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-fuchsia-500 outline-none resize-y"
        />
      </div>
    </div>
  );
}
