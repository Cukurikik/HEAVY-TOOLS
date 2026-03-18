"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function NoiseRemoverOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Reduction (dB)</Label><span className="text-red-400 font-black">{(task.options?.noiseReduction as number)||12}</span></div><Slider defaultValue={[12]} min={3} max={30} step={1} onValueChange={(v)=>setOptions({noiseReduction:v[0]})}/></div>);}
