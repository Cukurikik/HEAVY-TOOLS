"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{PitchShifterOptions}from"@/modules/audio-studio/components/tools/PitchShifterOptions";
export default function PitchShifterPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("pitch-shifter");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="pitch-shifter" title="Pitch Shifter" description="Ubah pitch ±24 semitone" options={<PitchShifterOptions/>}/></div>);}
