'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function ExtractPagesOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Pages to Extract (e.g. 1,3,5-7)</label>
          <input type="text" defaultValue="1" onChange={(e) => setOptions({ pageRange: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
    </div>
  );
}
