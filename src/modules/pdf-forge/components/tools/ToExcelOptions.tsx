'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function ToExcelOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input type="checkbox" defaultChecked={true} onChange={(e) => setOptions({ detectTables: e.target.checked })}
            className="w-4 h-4 accent-blue-500 rounded" />
          <label className="text-sm text-gray-300">Auto Detect Tables</label>
        </div>
    </div>
  );
}
