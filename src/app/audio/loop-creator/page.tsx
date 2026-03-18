"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{LoopCreatorOptions}from"@/modules/audio-studio/components/tools/LoopCreatorOptions";
export default function LoopCreatorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("loop-creator");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="loop-creator" title="Loop Creator" description="Buat audio loop seamless" options={<LoopCreatorOptions/>}/></div>);}
