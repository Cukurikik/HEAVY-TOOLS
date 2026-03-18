"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function TimeStretchOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Tempo</Label><span className="text-fuchsia-400 font-black text-lg">{(task.options?.tempo as number)||1.0}x</span></div><Slider defaultValue={[1.0]} min={0.5} max={2.0} step={0.05} onValueChange={(v)=>setOptions({tempo:v[0]})}/></div>);}
