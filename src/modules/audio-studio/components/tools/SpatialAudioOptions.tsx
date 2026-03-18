"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Label}from"@/components/ui/label";
export function SpatialAudioOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-4"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Mode</Label><div className="grid grid-cols-2 gap-2">{[{v:"surround",l:"🔊 Surround"},{v:"widening",l:"↔ Widening"}].map(m=>(<button key={m.v} onClick={()=>setOptions({mode:m.v})} className={`py-4 rounded-xl border text-sm font-bold transition-all ${(task.options?.mode||"surround")===m.v?"bg-indigo-600 border-indigo-500 text-white shadow-lg":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"}`}>{m.l}</button>))}</div></div>);}
