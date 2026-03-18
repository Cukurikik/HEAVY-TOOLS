"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/**
 * Audio Extractor — Configuration Panel
 * Ekstrak audio tanpa re-encoding
 */
export function AudioExtractorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Format</Label><Select defaultValue="mp3" onValueChange={(val)=>setOptions({format:val})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="mp3">MP3</SelectItem><SelectItem value="wav">WAV</SelectItem><SelectItem value="aac">AAC</SelectItem><SelectItem value="flac">FLAC</SelectItem><SelectItem value="ogg">OGG</SelectItem></SelectContent></Select></div></div>
  );
}
