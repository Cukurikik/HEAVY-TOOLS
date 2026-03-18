"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{TrimmerOptions}from"@/modules/audio-studio/components/tools/TrimmerOptions";
export default function TrimmerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("trimmer");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="trimmer" title="Audio Trimmer" description="Potong audio presisi millisecond" options={<TrimmerOptions/>}/></div>);}
