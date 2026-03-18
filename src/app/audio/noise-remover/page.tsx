"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{NoiseRemoverOptions}from"@/modules/audio-studio/components/tools/NoiseRemoverOptions";
export default function NoiseRemoverPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("noise-remover");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="noise-remover" title="Noise Remover" description="Hapus noise via afftdn filter" options={<NoiseRemoverOptions/>}/></div>);}
