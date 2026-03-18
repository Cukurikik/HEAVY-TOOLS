"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function WaveformVisualizerOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-green-500/5 border border-green-500/10 text-center space-y-2"><div className="text-green-400 font-black text-sm uppercase tracking-widest">Web Audio API</div><p className="text-green-300/60 text-xs font-medium">Real-time waveform rendering via AnalyserNode.</p></div>);}
