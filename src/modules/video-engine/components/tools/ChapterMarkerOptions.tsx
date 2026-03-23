"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Chapter Marker — Configuration Panel
 * Add chapter markers to video with dynamic inputs
 */
export function ChapterMarkerOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Chapters</Label>
        <p className="text-slate-500 text-[10px]">Format: one per line — <code className="text-indigo-400">HH:MM:SS=Title</code></p>
      </div>
      <textarea
        className="w-full h-40 bg-slate-800 border border-slate-700 text-white font-mono text-sm rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        defaultValue={"00:00:00=Intro\n00:01:00=Chapter 1\n00:05:00=Chapter 2"}
        onChange={(e) => setOptions({ chapters: e.target.value })}
      />
      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center">
        <p className="text-indigo-400 text-xs font-medium">📑 Chapter metadata embedded via FFMETADATA1 format</p>
      </div>
    </div>
  );
}
