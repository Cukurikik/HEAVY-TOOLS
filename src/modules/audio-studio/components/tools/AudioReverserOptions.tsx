"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function AudioReverserOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-5 rounded-xl bg-green-500/5 border border-green-500/10 text-center space-y-2"><div className="text-green-400 font-black text-sm uppercase tracking-widest">Audio Reverser</div><p className="text-green-300/60 text-xs font-medium">Plays the audio backwards perfectly.</p></div>);}
