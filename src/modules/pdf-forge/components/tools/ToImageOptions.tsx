'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function ToImageOptions() {
  const { task: { options: rawOpts }, setOptions } = usePdfStore();
  const options = rawOpts as Record<string, string | number | boolean>;
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Image Format</label>
          <select defaultValue="png" onChange={(e) => setOptions({ format: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="png">png</option>
            <option value="jpeg">jpeg</option>
            <option value="webp">webp</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Scale Factor: {options.scale ?? 2}</label>
          <input type="range" min={1} max={4} defaultValue={2} onChange={(e) => setOptions({ scale: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
    </div>
  );
}
