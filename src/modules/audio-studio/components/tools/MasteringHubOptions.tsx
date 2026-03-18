"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function MasteringHubOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Target Loudness (LUFS)</Label><span className="text-amber-400 font-black">{(task.options?.loudness as number)||-14}</span></div><Slider defaultValue={[-14]} min={-24} max={-6} step={1} onValueChange={(v)=>setOptions({loudness:v[0]})}/></div>);}
