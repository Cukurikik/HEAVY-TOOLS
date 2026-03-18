"use client";

import { useVideoStore } from "../../store/useVideoStore";


/**
 * Video Merger — Configuration Panel
 * Gabungkan multiple video via concat
 */
export function MergerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold text-center">Upload multiple video files. They will be concatenated in order.</div></div>
  );
}
