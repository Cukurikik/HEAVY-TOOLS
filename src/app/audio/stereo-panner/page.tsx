"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{StereoPannerOptions}from"@/modules/audio-studio/components/tools/StereoPannerOptions";
export default function StereoPannerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("stereo-panner");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="stereo-panner" title="Stereo Panner" description="Atur posisi stereo L/R" options={<StereoPannerOptions/>}/></div>);}
