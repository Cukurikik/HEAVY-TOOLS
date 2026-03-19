'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function RedactorOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Redaction Color</label>
          <select defaultValue="black" onChange={(e) => setOptions({ redactColor: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="black">black</option>
            <option value="white">white</option>
            <option value="gray">gray</option>
          </select>
        </div>
    </div>
  );
}
