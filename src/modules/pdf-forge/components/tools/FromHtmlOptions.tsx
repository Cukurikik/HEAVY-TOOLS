'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function FromHtmlOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">URL to Convert</label>
          <input type="text" defaultValue="https://" onChange={(e) => setOptions({ url: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Paper Format</label>
          <select defaultValue="A4" onChange={(e) => setOptions({ paperFormat: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
            <option value="A3">A3</option>
          </select>
        </div>
    </div>
  );
}
