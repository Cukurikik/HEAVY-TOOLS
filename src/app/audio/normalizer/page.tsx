"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{NormalizerOptions}from"@/modules/audio-studio/components/tools/NormalizerOptions";
export default function NormalizerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("normalizer");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="normalizer" title="Normalizer" description="Normalisasi volume via loudnorm" options={<NormalizerOptions/>}/></div>);}
