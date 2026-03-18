"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function SilenceRemoverOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Threshold (dB)</Label><span className="text-yellow-400 font-black">{(task.options?.threshold as number)||-40}</span></div><Slider defaultValue={[-40]} min={-60} max={-10} step={1} onValueChange={(v)=>setOptions({threshold:v[0]})}/></div>);}
