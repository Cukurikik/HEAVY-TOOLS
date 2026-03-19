'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function ReorderPagesOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <p className="text-gray-500 text-sm italic">No additional options needed</p>
    </div>
  );
}
