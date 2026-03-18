"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{MergerOptions}from"@/modules/audio-studio/components/tools/MergerOptions";
export default function MergerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("merger");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="merger" title="Audio Merger" description="Gabungkan multiple audio track" options={<MergerOptions/>} isMultiFile={true}/></div>);}
