'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function WatermarkOptions() {
  const { task: { options: rawOpts }, setOptions } = usePdfStore();
  const options = rawOpts as Record<string, string | number | boolean>;
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Watermark Text</label>
          <input type="text" defaultValue="CONFIDENTIAL" onChange={(e) => setOptions({ text: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Opacity: {options.opacity ?? 30}</label>
          <input type="range" min={5} max={100} defaultValue={30} onChange={(e) => setOptions({ opacity: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Font Size: {options.fontSize ?? 48}</label>
          <input type="range" min={12} max={120} defaultValue={48} onChange={(e) => setOptions({ fontSize: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
    </div>
  );
}
