'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function TableExtractorOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output Format</label>
          <select defaultValue="csv" onChange={(e) => setOptions({ outputFormat: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="csv">csv</option>
            <option value="json">json</option>
            <option value="xlsx">xlsx</option>
          </select>
        </div>
    </div>
  );
}
