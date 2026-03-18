"use client";

import { useVideoStore } from "../../store/useVideoStore";


/**
 * Video Reverser — Configuration Panel
 * Balik video frame-by-frame
 */
export function ReverseOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center space-y-2"><div className="text-purple-400 font-black text-sm uppercase tracking-widest">Reverse Engine</div><p className="text-purple-300/60 text-xs font-medium">Reverses both video and audio frame-by-frame.</p></div>
  );
}
