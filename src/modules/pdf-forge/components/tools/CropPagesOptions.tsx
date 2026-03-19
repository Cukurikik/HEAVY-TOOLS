'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function CropPagesOptions() {
  const { task: { options: rawOpts }, setOptions } = usePdfStore();
  const options = rawOpts as Record<string, string | number | boolean>;
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Top Margin (pt): {options.marginTop ?? 0}</label>
          <input type="range" min={0} max={200} defaultValue={0} onChange={(e) => setOptions({ marginTop: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Bottom Margin (pt): {options.marginBottom ?? 0}</label>
          <input type="range" min={0} max={200} defaultValue={0} onChange={(e) => setOptions({ marginBottom: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
    </div>
  );
}
