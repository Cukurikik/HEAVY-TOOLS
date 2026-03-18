"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Watermark Tool — Configuration Panel
 * Tambah watermark teks
 */
export function WatermarkOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Watermark Text</Label><Input type="text" defaultValue="HEAVY-TOOLS" className="bg-slate-800 border-slate-700 text-white" onChange={(e)=>setOptions({text:e.target.value})} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Pos X</Label><Input type="text" defaultValue="10" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e)=>setOptions({posX:e.target.value})} /></div><div className="space-y-2"><Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Pos Y</Label><Input type="text" defaultValue="10" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e)=>setOptions({posY:e.target.value})} /></div></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Size</Label><Input type="number" defaultValue="24" className="bg-slate-800 border-slate-700 text-white font-mono text-xs" onChange={(e)=>setOptions({fontSize:parseInt(e.target.value)})} /></div><div className="space-y-2"><Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Color</Label><Select defaultValue="white" onValueChange={(val)=>setOptions({fontColor:val})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="white">White</SelectItem><SelectItem value="black">Black</SelectItem><SelectItem value="red">Red</SelectItem><SelectItem value="yellow">Yellow</SelectItem></SelectContent></Select></div></div></div>
  );
}
