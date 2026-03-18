"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{TimeStretchOptions}from"@/modules/audio-studio/components/tools/TimeStretchOptions";
export default function TimeStretchPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("time-stretch");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="time-stretch" title="Time Stretch" description="Ubah tempo tanpa ubah pitch" options={<TimeStretchOptions/>}/></div>);}
