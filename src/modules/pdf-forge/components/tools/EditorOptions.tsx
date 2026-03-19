'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function EditorOptions() {
  const { task: { options: rawOpts }, setOptions } = usePdfStore();
  const options = rawOpts as Record<string, string | number | boolean>;
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Font Size: {options.fontsize ?? 12}</label>
          <input type="range" min={6} max={72} defaultValue={12} onChange={(e) => setOptions({ fontsize: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
    </div>
  );
}
