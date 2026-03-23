"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function EncryptOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-6">
        <h4 className="text-blue-400 font-bold mb-1">AES-256 Encryption</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          Secures your PDF so that it cannot be opened without the password. The strongest possible encryption algorithm is used by default.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">User Password</label>
          <input
            type="password"
            placeholder="Required to open the file"
            value={(opts.password as string) || ""}
            onChange={(e) => setOptions({ password: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Owner Password (Optional)</label>
          <input
            type="password"
            placeholder="Required to change permissions later"
            value={(opts.ownerPassword as string) || ""}
            onChange={(e) => setOptions({ ownerPassword: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
