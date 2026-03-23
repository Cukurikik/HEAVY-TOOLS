"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function BatchProcessorOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-6">
        <h4 className="text-zinc-400 font-bold mb-1">Bulk Pipeline Execution</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          Upload hundreds of PDFs and apply the same operation to all of them simultaneously using Web Workers.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Batch Operation</label>
        <select
          value={(opts.batchType as string) || "merge"}
          onChange={(e) => setOptions({ batchType: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-zinc-500 outline-none"
        >
          <option value="merge">Merge All Together</option>
          <option value="compress">Compress All Independently</option>
          <option value="watermark">Watermark All Independently</option>
        </select>
      </div>
      
      {opts.batchType === 'watermark' && (
        <div className="p-4 rounded-xl bg-slate-800/50 mt-4 text-xs text-zinc-400">
          * Default watermark will be applied: "CONFIDENTIAL" at 25% opacity, 45deg rotation.
        </div>
      )}
    </div>
  );
}
