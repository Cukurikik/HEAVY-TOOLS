"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function MagicByteDetectorOptions() {
  const { task } = useConverterStore();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Selected Target</label>
        <div className="w-full bg-slate-800/50 border border-slate-500/20 rounded-xl px-4 py-3 text-slate-200">
          {task.files.length > 0 ? task.files[0].name : "No file dropped yet. Awaiting analysis target."}
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
        <p className="text-xs text-slate-300/80 leading-relaxed font-medium">
          The Magic Byte engine reads the raw hex container signature of your file (first 32 bytes) deeply inside memory, ignoring the <code>.ext</code> file extension, to truly reveal what file type architecture it is compiled with.
        </p>
      </div>
    </div>
  );
}
