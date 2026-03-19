'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function BatchProcessorOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Batch Operation</label>
          <select defaultValue="merge" onChange={(e) => setOptions({ batchOperation: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="merge">merge</option>
            <option value="compress">compress</option>
            <option value="rotate">rotate</option>
            <option value="watermark">watermark</option>
          </select>
        </div>
    </div>
  );
}
