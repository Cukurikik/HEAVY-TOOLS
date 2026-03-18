"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Input}from"@/components/ui/input";
import{Label}from"@/components/ui/label";
export function TrimmerOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Start</Label><Input type="text" defaultValue="00:00:00" placeholder="HH:MM:SS" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e)=>setOptions({start:e.target.value})}/></div><div className="space-y-2"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">End</Label><Input type="text" defaultValue="00:00:10" placeholder="HH:MM:SS" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e)=>setOptions({end:e.target.value})}/></div></div></div>);}
