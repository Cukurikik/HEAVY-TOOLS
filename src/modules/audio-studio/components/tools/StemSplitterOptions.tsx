"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function StemSplitterOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-pink-500/5 border border-pink-500/10 text-center space-y-2"><div className="text-pink-400 font-black text-sm uppercase tracking-widest">AI Stem Engine</div><p className="text-pink-300/60 text-xs font-medium">Separates vocals from instruments using phase cancellation.</p></div>);}
