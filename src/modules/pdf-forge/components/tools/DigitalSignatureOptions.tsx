"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function DigitalSignatureOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 mb-6">
        <h4 className="text-sky-400 font-bold mb-1">PAdES Standard Signature</h4>
        <p className="text-xs text-sky-200/60 leading-relaxed font-medium">
          Certifies the document integrity using a cryptographic digital signature. Optional: upload your own PKCS#12 (.p12) certificate file.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Certificate Source</label>
        <select
          value={(opts.certSource as string) || "auto"}
          onChange={(e) => setOptions({ certSource: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500 outline-none"
        >
          <option value="auto">Auto-Generate Omni-Tool Self-Signed CA</option>
          <option value="custom">Upload Custom (.p12 / .pfx)</option>
        </select>
      </div>
    </div>
  );
}
