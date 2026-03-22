'use client';
import React from 'react';
import { usePdfStore } from '../../store/usePdfStore';

export default function EncryptOptions() {
  const { task: { options }, setOptions } = usePdfStore();
  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input type="password" defaultValue="" onChange={(e) => {
            const val = e.target.value;
            setOptions({ password: val, isValidPassword: val.length >= 8 });
          }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="Min. 8 characters" />
          {options.password !== undefined && !options.isValidPassword && (
            <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters long.</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Algorithm</label>
          <select defaultValue="AES-256" onChange={(e) => setOptions({ algorithm: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
            <option value="AES-128">AES-128</option>
            <option value="AES-256">AES-256</option>
          </select>
        </div>
    </div>
  );
}
