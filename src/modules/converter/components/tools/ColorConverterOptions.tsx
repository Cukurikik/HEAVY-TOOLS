"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function ColorConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">HEX Color Input</label>
        <div className="flex bg-slate-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-pink-500">
          <div 
            className="w-16 flex-shrink-0 border-r border-white/10" 
            style={{ backgroundColor: (opts.directInput as string) || "#FF5500" }} 
          />
          <input
            type="text"
            value={(opts.directInput as string) || ""}
            onChange={(e) => setOptions({ directInput: e.target.value })}
            placeholder="#FF5500"
            className="w-full bg-transparent px-4 py-3 text-white font-mono outline-none"
          />
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
        <p className="text-xs text-pink-200/60 font-medium">
          Note: System will autocalculate equivalent RGB and HSL values from the hex string instantly. (CMYK currently limited).
        </p>
      </div>
    </div>
  );
}
