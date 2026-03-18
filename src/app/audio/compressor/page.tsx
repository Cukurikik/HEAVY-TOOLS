"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{CompressorOptions}from"@/modules/audio-studio/components/tools/CompressorOptions";
export default function CompressorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("compressor");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="compressor" title="Audio Compressor" description="Dynamic range compression" options={<CompressorOptions/>}/></div>);}
