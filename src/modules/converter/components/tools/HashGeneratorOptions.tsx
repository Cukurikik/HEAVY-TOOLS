"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function HashGeneratorOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Hashing Algorithm</label>
        <select
          value={(opts.algorithm as string) || "SHA-256"}
          onChange={(e) => setOptions({ algorithm: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-stone-500 outline-none"
        >
          <option value="SHA-1">SHA-1 (Legacy)</option>
          <option value="SHA-256">SHA-256 (Standard)</option>
          <option value="SHA-384">SHA-384 (High Security)</option>
          <option value="SHA-512">SHA-512 (Ultra Security)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Text Input (Ignore to hash file)</label>
        <textarea
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="Paste string to hash..."
          className="w-full h-32 bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-stone-500 outline-none resize-y"
        />
      </div>
      
      <p className="text-xs text-slate-500">
        File hashing is performed entirely locally via `crypto.subtle`. For large files, memory constraints apply.
      </p>
    </div>
  );
}
