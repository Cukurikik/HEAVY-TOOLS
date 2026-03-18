"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{MasteringHubOptions}from"@/modules/audio-studio/components/tools/MasteringHubOptions";
export default function MasteringHubPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("mastering-hub");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="mastering-hub" title="Mastering Hub" description="Compressor→Limiter→EQ profesional" options={<MasteringHubOptions/>}/></div>);}
