"use client";
import React from "react";
import { useConverterStore } from "../../store/useConverterStore";

export function AudioConverterOptions() {
  const { task, setOptions } = useConverterStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target Audio Format</label>
        <select
          value={(opts.format as string) || "mp3"}
          onChange={(e) => setOptions({ format: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
        >
          <option value="mp3">MP3 (MPEG Audio Layer III)</option>
          <option value="wav">WAV (Uncompressed PCM)</option>
          <option value="ogg">OGG (Vorbis Default)</option>
          <option value="flac">FLAC (Lossless Compression)</option>
        </select>
      </div>
    </div>
  );
}
