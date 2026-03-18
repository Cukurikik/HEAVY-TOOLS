"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/**
 * Video Converter — Configuration Panel
 * Konversi format: MP4/WebM/MKV/MOV/AVI
 */
export function ConverterOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Output Format</Label><Select defaultValue="mp4" onValueChange={(val) => setOptions({ format: val })}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select format" /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="mp4">MP4 (H.264)</SelectItem><SelectItem value="webm">WebM (VP9)</SelectItem><SelectItem value="mkv">MKV</SelectItem><SelectItem value="mov">MOV</SelectItem><SelectItem value="avi">AVI</SelectItem></SelectContent></Select></div></div>
  );
}
