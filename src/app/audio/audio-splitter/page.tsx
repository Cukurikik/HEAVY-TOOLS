"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{AudioSplitterOptions}from"@/modules/audio-studio/components/tools/AudioSplitterOptions";
export default function AudioSplitterPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("audio-splitter");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="audio-splitter" title="Audio Splitter" description="Pecah audio berdasarkan waktu" options={<AudioSplitterOptions/>}/></div>);}
