'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function OcrOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Language</label>
          <select defaultValue="eng" onChange={(e) => setOptions({ language: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="eng">eng</option>
            <option value="ind">ind</option>
            <option value="jpn">jpn</option>
            <option value="kor">kor</option>
            <option value="chi_sim">chi_sim</option>
            <option value="fra">fra</option>
            <option value="deu">deu</option>
            <option value="spa">spa</option>
          </select>
        </div>
    </div>
  );
}
