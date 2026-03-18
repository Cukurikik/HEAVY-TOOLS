"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function AudioRecorderOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-4"><div className="space-y-3"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Duration (sec)</Label><span className="text-red-400 font-black">{(task.options?.duration as number)||10}s</span></div><Slider defaultValue={[10]} min={5} max={180} step={5} onValueChange={(v)=>setOptions({duration:v[0]})}/></div><div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/70 text-[10px] font-bold text-center uppercase tracking-widest">System + Microphone capture</div></div>);}
