'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function MetadataEditorOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input type="text" defaultValue="" onChange={(e) => setOptions({ title: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Author</label>
          <input type="text" defaultValue="" onChange={(e) => setOptions({ author: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Subject</label>
          <input type="text" defaultValue="" onChange={(e) => setOptions({ subject: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Keywords (comma-separated)</label>
          <input type="text" defaultValue="" onChange={(e) => setOptions({ keywords: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" />
        </div>
    </div>
  );
}
