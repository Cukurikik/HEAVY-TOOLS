"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function BpmDetectorOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-center space-y-2"><div className="text-rose-400 font-black text-sm uppercase tracking-widest">FFT Analysis</div><p className="text-rose-300/60 text-xs font-medium">Detects BPM using Web Audio AnalyserNode.</p></div>);}
