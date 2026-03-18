"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{KeyFinderOptions}from"@/modules/audio-studio/components/tools/KeyFinderOptions";
export default function KeyFinderPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("key-finder");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="key-finder" title="Key Finder" description="Deteksi key/nada dasar lagu" options={<KeyFinderOptions/>} isAnalyzer={true}/></div>);}
