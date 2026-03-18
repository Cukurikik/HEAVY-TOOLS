"use client";

import { useVideoStore } from "../../store/useVideoStore";


/**
 * HDR Tonemapper — Configuration Panel
 * HDR ke SDR via tonemap
 */
export function HdrTonemapperOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/10 text-center space-y-2"><div className="text-orange-400 font-black text-sm uppercase tracking-widest">HDR → SDR</div><p className="text-orange-300/60 text-xs font-medium">Hable tonemap with BT.709 color space.</p></div>
  );
}
