"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function LoopCreatorOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Loops</Label><span className="text-pink-400 font-black text-lg">{(task.options?.loops as number)||3}x</span></div><Slider defaultValue={[3]} min={2} max={20} step={1} onValueChange={(v)=>setOptions({loops:v[0]})}/></div>);}
