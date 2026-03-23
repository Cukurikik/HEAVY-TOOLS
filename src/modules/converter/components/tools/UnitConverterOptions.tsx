"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function UnitConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;
  const unitType = (opts.unitType as string) || "length";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Measurement Type</label>
        <select
          value={unitType}
          onChange={(e) => setOptions({ unitType: e.target.value, fromUnit: "meters", toUnit: "feet" })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
        >
          <option value="length">Length / Distance</option>
          <option value="weight">Mass / Weight</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">From</label>
          <select
            value={(opts.fromUnit as string) || "meters"}
            onChange={(e) => setOptions({ fromUnit: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
          >
            {unitType === "length" ? (
              <>
                <option value="meters">Meters</option>
                <option value="kilometers">Kilometers</option>
                <option value="feet">Feet</option>
                <option value="inches">Inches</option>
              </>
            ) : (
              <>
                <option value="kilograms">Kilograms</option>
                <option value="pounds">Pounds</option>
                <option value="ounces">Ounces</option>
              </>
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">To</label>
          <select
            value={(opts.toUnit as string) || "feet"}
            onChange={(e) => setOptions({ toUnit: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
          >
            {unitType === "length" ? (
              <>
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
                <option value="kilometers">Kilometers</option>
                <option value="inches">Inches</option>
              </>
            ) : (
              <>
                <option value="pounds">Pounds</option>
                <option value="kilograms">Kilograms</option>
                <option value="ounces">Ounces</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Value to Convert</label>
        <input
          type="number"
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="100.5"
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none"
        />
      </div>
    </div>
  );
}
