"use client";

import { Monitor, AlertCircle } from "lucide-react";

/**
 * Screen Recorder — Configuration Panel
 * Rekam layar via getDisplayMedia()
 */
export function ScreenRecorderOptions() {
  return (
    <div className="space-y-5">
      {/* How it works */}
      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">
            How It Works
          </span>
        </div>
        <ol className="text-slate-400 text-sm font-medium space-y-2 list-decimal list-inside">
          <li>Click <span className="text-white font-bold">START ENGINE</span> below</li>
          <li>Choose a screen, window, or tab to share</li>
          <li>Click <span className="text-white font-bold">&quot;Stop sharing&quot;</span> when done</li>
          <li>Download your recording as WebM</li>
        </ol>
      </div>

      {/* Info badge */}
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center space-x-3">
        <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="text-emerald-400/80 text-xs font-bold">
          No file upload needed — recording is captured directly from your browser.
        </p>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5 text-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Format</p>
          <p className="text-white font-black text-sm">WebM (VP9)</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5 text-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Resolution</p>
          <p className="text-white font-black text-sm">Up to 1080p</p>
        </div>
      </div>
    </div>
  );
}
