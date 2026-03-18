"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function KeyFinderOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center space-y-2"><div className="text-amber-400 font-black text-sm uppercase tracking-widest">Chromatic Analysis</div><p className="text-amber-300/60 text-xs font-medium">Identifies musical key via spectral analysis.</p></div>);}
