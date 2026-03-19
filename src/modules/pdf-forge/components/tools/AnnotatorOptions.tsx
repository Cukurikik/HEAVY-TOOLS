'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function AnnotatorOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Annotation Color</label>
          <select defaultValue="#FFFF00" onChange={(e) => setOptions({ color: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="#FFFF00">#FFFF00</option>
            <option value="#FF0000">#FF0000</option>
            <option value="#00FF00">#00FF00</option>
            <option value="#0000FF">#0000FF</option>
            <option value="#FF00FF">#FF00FF</option>
          </select>
        </div>
    </div>
  );
}
