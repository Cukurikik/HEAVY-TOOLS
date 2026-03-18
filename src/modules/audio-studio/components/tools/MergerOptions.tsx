"use client";
import{useAudioStore}from"../../store/useAudioStore";

export function MergerOptions(){const{setOptions,task}=useAudioStore();return(<div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold text-center">Upload multiple audio files to merge.</div>);}
