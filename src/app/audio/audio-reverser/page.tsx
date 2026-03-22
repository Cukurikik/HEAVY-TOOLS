"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{AudioReverserOptions}from"@/modules/audio-studio/components/tools/AudioReverserOptions";
export default function AudioReverserPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("audio-reverser");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="audio-reverser" title="Audio Reverser" description="Memutar audio secara terbalik" options={<AudioReverserOptions/>}/></div>);}
