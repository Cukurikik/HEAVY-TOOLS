'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function ConverterOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Target Format</label>
          <select defaultValue="docx" onChange={(e) => setOptions({ targetFormat: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="docx">docx</option>
            <option value="xlsx">xlsx</option>
            <option value="pptx">pptx</option>
            <option value="odt">odt</option>
          </select>
        </div>
    </div>
  );
}
