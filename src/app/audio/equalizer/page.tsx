"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{EqualizerOptions}from"@/modules/audio-studio/components/tools/EqualizerOptions";
export default function EqualizerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("equalizer");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="equalizer" title="Equalizer" description="3-band parametric EQ" options={<EqualizerOptions/>}/></div>);}
