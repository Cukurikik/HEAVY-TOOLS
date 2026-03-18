"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function PitchShifterOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Semitones</Label><span className="text-indigo-400 font-black text-lg">{(task.options?.semitones as number)||0}</span></div><Slider defaultValue={[0]} min={-24} max={24} step={1} onValueChange={(v)=>setOptions({semitones:v[0]})}/><div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold"><span>-24</span><span>+24</span></div></div>);}
