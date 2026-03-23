"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function TimezoneConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Timezone</label>
        <select
          value={(opts.timezone as string) || "America/New_York"}
          onChange={(e) => setOptions({ timezone: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
        >
          <option value="America/New_York">EST (New York)</option>
          <option value="America/Los_Angeles">PST (Los Angeles)</option>
          <option value="Europe/London">GMT (London)</option>
          <option value="Europe/Paris">CET (Paris)</option>
          <option value="Asia/Tokyo">JST (Tokyo)</option>
          <option value="Asia/Jakarta">WIB (Jakarta)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Time Input</label>
        <input
          type="text"
          value={(opts.directInput as string) || "now"}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="e.g: 'now' or ISO string '2025-01-01T12:00:00'"
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-indigo-500 outline-none"
        />
      </div>
    </div>
  );
}
