"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function BarcodeGeneratorOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Barcode Symbology</label>
        <select
          value={(opts.format as string) || "CODE128"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
        >
          <option value="CODE128">CODE128 (Universal Alphanumeric)</option>
          <option value="CODE39">CODE39 (Basic Alphanumeric)</option>
          <option value="EAN13">EAN-13 (Standard Retail)</option>
          <option value="EAN8">EAN-8 (Small Retail)</option>
          <option value="UPC">UPC-A (US/Canada Retail)</option>
          <option value="ITF14">ITF-14 (Shipping Cartons)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Payload / Product Code</label>
        <input
          type="text"
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="e.g. 123456789012"
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-red-500"
        />
        <p className="text-xs text-red-500/80 mt-2">
          Make sure your payload strictly matches the selected symbology rules! For example, EAN-13 expects exactly 12 or 13 numeric digits.
        </p>
      </div>
    </div>
  );
}
