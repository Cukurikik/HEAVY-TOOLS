"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function KaraokeMakerOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center space-y-2"><div className="text-purple-400 font-black text-sm uppercase tracking-widest">Vocal Remover</div><p className="text-purple-300/60 text-xs font-medium">Phase-cancellation removes center-panned vocals.</p></div>);}
