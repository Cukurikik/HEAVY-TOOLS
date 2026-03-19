'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function CompressorOptions() {
  const { task: { options: rawOpts }, setOptions } = usePdfStore();
  const options = rawOpts as Record<string, string | number | boolean>;
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Quality: {options.quality ?? 80}</label>
          <input type="range" min={10} max={100} defaultValue={80} onChange={(e) => setOptions({ quality: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
    </div>
  );
}
