"use client";

import { useVideoStore } from "../../store/useVideoStore";


/**
 * Video Stabilizer — Configuration Panel
 * Stabilisasi video dengan deshake filter
 */
export function StabilizerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-2"><div className="text-emerald-400 font-black text-sm uppercase tracking-widest">Deshake Engine</div><p className="text-emerald-300/60 text-xs font-medium">Stabilizes shaky footage using FFmpeg deshake filter.</p></div>
  );
}
