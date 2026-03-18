"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function SpectrumAnalyzerOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-center space-y-2"><div className="text-cyan-400 font-black text-sm uppercase tracking-widest">FFT Spectrum</div><p className="text-cyan-300/60 text-xs font-medium">Real-time frequency analysis via Web Audio.</p></div>);}
