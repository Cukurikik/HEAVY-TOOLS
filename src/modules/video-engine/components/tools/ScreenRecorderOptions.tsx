"use client";

import { useVideoStore } from "../../store/useVideoStore";


/**
 * Screen Recorder — Configuration Panel
 * Rekam layar via getDisplayMedia()
 */
export function ScreenRecorderOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10 text-center space-y-2"><div className="text-red-400 font-black text-sm uppercase tracking-widest">Browser Capture API</div><p className="text-red-300/60 text-xs font-medium">Click START ENGINE to begin. Click &quot;Stop sharing&quot; to finish.</p></div><div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/70 text-[10px] font-bold text-center uppercase tracking-widest">No file upload needed</div></div>
  );
}
