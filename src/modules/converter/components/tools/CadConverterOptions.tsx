"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function CadConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target CAD View Format</label>
        <select
          value={(opts.format as string) || "pdf"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-slate-500 outline-none"
        >
          <option value="pdf">PDF (Printable Vector Map)</option>
          <option value="svg">SVG (Web Scaleable Vector)</option>
          <option value="dxf">DXF (Standard Interchange)</option>
        </select>
      </div>
      
      <p className="text-xs text-slate-500">
        Compatible with standard flat AutoCAD DWG/DXF files up to 2018 format.
      </p>
    </div>
  );
}
