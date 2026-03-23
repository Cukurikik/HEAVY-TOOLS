"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function WatermarkOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Watermark Text</label>
        <input
          type="text"
          placeholder="CONFIDENTIAL"
          value={(opts.text as string) || "CONFIDENTIAL"}
          onChange={(e) => setOptions({ text: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none placeholder:text-slate-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Opacity</label>
            <span className="text-cyan-400 font-mono text-xs bg-cyan-500/10 px-2 py-1 rounded">
              {((opts.opacity as number) ?? 0.25) * 100}%
            </span>
          </div>
          <input
            type="range"
            min="0.05" max="1" step="0.05"
            value={(opts.opacity as number) ?? 0.25}
            onChange={(e) => setOptions({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Rotation</label>
            <span className="text-cyan-400 font-mono text-xs bg-cyan-500/10 px-2 py-1 rounded">
              {(opts.rotation as number) ?? 45}°
            </span>
          </div>
          <input
            type="range"
            min="0" max="360" step="15"
            value={(opts.rotation as number) ?? 45}
            onChange={(e) => setOptions({ rotation: parseInt(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
