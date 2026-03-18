"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function AudioSplitterOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Segment (sec)</Label><span className="text-red-400 font-black text-lg">{(task.options?.segmentDuration as number)||30}s</span></div><Slider defaultValue={[30]} min={5} max={300} step={5} onValueChange={(v)=>setOptions({segmentDuration:v[0]})}/></div>);}
