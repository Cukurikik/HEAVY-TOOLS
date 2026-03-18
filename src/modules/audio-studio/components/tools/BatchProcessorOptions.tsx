"use client";
import{useAudioStore}from"../../store/useAudioStore";
import{Select,SelectContent,SelectItem,SelectTrigger,SelectValue}from"@/components/ui/select";
import{Label}from"@/components/ui/label";
export function BatchProcessorOptions(){const{setOptions,task}=useAudioStore();return(<div className="space-y-4"><Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Operation</Label><Select defaultValue="normalize" onValueChange={(v)=>setOptions({batchOperation:v})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue/></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="normalize">Normalize</SelectItem><SelectItem value="compress">Compress MP3</SelectItem></SelectContent></Select></div>);}
