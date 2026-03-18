"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function PodcastEnhancerOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-violet-500/5 border border-violet-500/10 text-center space-y-2"><div className="text-violet-400 font-black text-sm uppercase tracking-widest">Podcast Chain</div><p className="text-violet-300/60 text-xs font-medium">Highpass → Compressor → Loudness Normalization</p></div>);}
