'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function BookmarksEditorOptions() {
  const { task: { options: rawOpts }, setOptions } = usePdfStore();
  const options = rawOpts as Record<string, string | number | boolean>;
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Bookmark Title</label>
          <input type="text" defaultValue="Chapter 1" onChange={(e) => setOptions({ bookmarkTitle: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Target Page: {options.bookmarkPage ?? 1}</label>
          <input type="range" min={1} max={999} defaultValue={1} onChange={(e) => setOptions({ bookmarkPage: Number(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>
    </div>
  );
}
