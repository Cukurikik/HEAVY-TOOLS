"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{SilenceRemoverOptions}from"@/modules/audio-studio/components/tools/SilenceRemoverOptions";
export default function SilenceRemoverPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("silence-remover");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="silence-remover" title="Silence Remover" description="Hapus bagian hening otomatis" options={<SilenceRemoverOptions/>}/></div>);}
