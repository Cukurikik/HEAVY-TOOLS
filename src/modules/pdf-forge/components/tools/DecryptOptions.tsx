"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function DecryptOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
        <h4 className="text-indigo-400 font-bold mb-1">Permanent Decryption</h4>
        <p className="text-xs text-indigo-200/60 leading-relaxed font-medium">
          Removes AES encryption and permanently unlocks all document permissions (printing, copying, editing). You must provide the current password to unlock it first.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Current Password</label>
        <input
          type="password"
          placeholder="Enter the PDF password"
          value={(opts.password as string) || ""}
          onChange={(e) => setOptions({ password: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
        />
      </div>
    </div>
  );
}
