"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function CurrencyConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">From Currency</label>
          <select
            value={(opts.fromCurrency as string) || "USD"}
            onChange={(e) => setOptions({ fromCurrency: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">To Currency</label>
          <select
            value={(opts.toCurrency as string) || "EUR"}
            onChange={(e) => setOptions({ toCurrency: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
          >
            <option value="EUR">EUR - Euro</option>
            <option value="USD">USD - US Dollar</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Amount</label>
        <input
          type="number"
          value={(opts.directInput as string) || ""}
          onChange={(e) => setOptions({ directInput: e.target.value })}
          placeholder="100.50"
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-green-500 outline-none"
        />
      </div>
      
      <p className="text-xs text-slate-500">Live exchange rates updated daily via API route.</p>
    </div>
  );
}
