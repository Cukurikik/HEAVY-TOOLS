"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function NormalizerOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Target (LUFS)</Label><span className="text-lime-400 font-black">{(task.options?.targetLoudness as number)||-16}</span></div><Slider defaultValue={[-16]} min={-24} max={-6} step={1} onValueChange={(v)=>setOptions({targetLoudness:v[0]})}/></div>);}
