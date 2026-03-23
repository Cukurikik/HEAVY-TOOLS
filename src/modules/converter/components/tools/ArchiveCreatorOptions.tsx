"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function ArchiveCreatorOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex justify-between items-center">
        <div>
          <label className="text-sm font-bold text-slate-400 block">Compression Level</label>
          <span className="text-xs text-slate-500">Higher level means smaller file but takes longer</span>
        </div>
        <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-1 rounded">
          Level {(opts.level as number) || 6}
        </span>
      </div>
      <input
        type="range"
        min="1" max="9" step="1"
        value={(opts.level as number) || 6}
        onChange={(e) => setOptions({ level: parseInt(e.target.value) })}
        className="w-full accent-blue-500"
      />
      
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-200/60 font-medium">
          You currently have {task.files.length} flat files queued for archiving.
        </p>
      </div>
    </div>
  );
}
