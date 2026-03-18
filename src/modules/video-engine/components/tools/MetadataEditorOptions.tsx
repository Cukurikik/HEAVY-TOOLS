"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Metadata Editor — Configuration Panel
 * Edit title, author, copyright
 */
export function MetadataEditorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Title</Label><Input type="text" placeholder="Video title..." className="bg-slate-800 border-slate-700 text-white" onChange={(e)=>setOptions({title:e.target.value})} /></div><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Author</Label><Input type="text" placeholder="Author..." className="bg-slate-800 border-slate-700 text-white" onChange={(e)=>setOptions({author:e.target.value})} /></div><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Copyright</Label><Input type="text" placeholder="© 2026..." className="bg-slate-800 border-slate-700 text-white" onChange={(e)=>setOptions({copyright:e.target.value})} /></div></div>
  );
}
