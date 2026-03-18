"use client";

import { useVideoStore } from "../../store/useVideoStore";


/**
 * Black & White — Configuration Panel
 * Grayscale via hue=s=0
 */
export function BlackWhiteOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="p-5 rounded-xl bg-gray-500/5 border border-gray-500/10 text-center space-y-2"><div className="text-gray-300 font-black text-sm uppercase tracking-widest">Grayscale Filter</div><p className="text-gray-400/60 text-xs font-medium">Converts to black & white. Audio preserved.</p></div>
  );
}
