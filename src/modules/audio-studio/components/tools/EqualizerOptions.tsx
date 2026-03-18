"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Slider}from"@/components/ui/slider";
import{Label}from"@/components/ui/label";
export function EqualizerOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-5">{[{k:"bass",l:"Bass (100Hz)",def:0},{k:"mid",l:"Mid (1kHz)",def:0},{k:"treble",l:"Treble (8kHz)",def:0}].map(b=>(<div key={b.k} className="space-y-3"><div className="flex items-center justify-between"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">{b.l}</Label><span className="text-cyan-400 font-black">{(task.options?.[b.k] as number)??b.def} dB</span></div><Slider defaultValue={[b.def]} min={-12} max={12} step={1} onValueChange={(v)=>setOptions({[b.k]:v[0]})}/></div>))}</div>);}
