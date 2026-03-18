"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{StemSplitterOptions}from"@/modules/audio-studio/components/tools/StemSplitterOptions";
export default function StemSplitterPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("stem-splitter");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="stem-splitter" title="AI Stem Splitter" description="Pisahkan vokal, drum, bass, instrumen" options={<StemSplitterOptions/>}/></div>);}
