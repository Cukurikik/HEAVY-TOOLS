"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function StereoPannerOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Pan</Label><span className="text-sky-400 font-black">{(task.options?.pan as number)||0}</span></div><Slider defaultValue={[0]} min={-1} max={1} step={0.05} onValueChange={(v)=>setOptions({pan:v[0]})}/><div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold"><span>← Left</span><span>Right →</span></div></div>);}
