"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function ArchiveExtractorOptions() {
  const { task } = useConverterStore();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Selected Archive</label>
        <div className="w-full bg-slate-800/50 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-200">
          {task.files.length > 0 ? task.files[0].name : "No file selected. Please drop a ZIP file."}
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-200/60 leading-relaxed font-medium">
          The contents of the archive will be extracted directly in your browser. Large directories may trigger multiple file downloads natively.
        </p>
      </div>
    </div>
  );
}
