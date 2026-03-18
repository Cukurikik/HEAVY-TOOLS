"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{VoiceIsolatorOptions}from"@/modules/audio-studio/components/tools/VoiceIsolatorOptions";
export default function VoiceIsolatorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("voice-isolator");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="voice-isolator" title="Voice Isolator" description="Isolasi vokal dari instrumen" options={<VoiceIsolatorOptions/>}/></div>);}
