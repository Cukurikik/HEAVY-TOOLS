'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function FromImageOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Page Size</label>
          <select defaultValue="fit" onChange={(e) => setOptions({ pageSize: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="fit">fit</option>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="A3">A3</option>
          </select>
        </div>
    </div>
  );
}
