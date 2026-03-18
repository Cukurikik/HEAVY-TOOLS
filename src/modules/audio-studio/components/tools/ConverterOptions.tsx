"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Select,SelectContent,SelectItem,SelectTrigger,SelectValue}from"@/components/ui/select";
import{Label}from"@/components/ui/label";
export function ConverterOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-4"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Format</Label><Select defaultValue="mp3" onValueChange={(v)=>setOptions({format:v})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue/></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="mp3">MP3</SelectItem><SelectItem value="wav">WAV</SelectItem><SelectItem value="ogg">OGG</SelectItem><SelectItem value="flac">FLAC</SelectItem><SelectItem value="aac">AAC</SelectItem></SelectContent></Select></div>);}
