'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function RotatePagesOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Rotation Angle</label>
          <select defaultValue="90" onChange={(e) => setOptions({ angle: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="90">90</option>
            <option value="180">180</option>
            <option value="270">270</option>
          </select>
        </div>
    </div>
  );
}
