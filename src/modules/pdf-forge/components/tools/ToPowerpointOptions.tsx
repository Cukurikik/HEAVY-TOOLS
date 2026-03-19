'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function ToPowerpointOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Slide Size</label>
          <select defaultValue="16:9" onChange={(e) => setOptions({ slideSize: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
          </select>
        </div>
    </div>
  );
}
