"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{ReverbOptions}from"@/modules/audio-studio/components/tools/ReverbOptions";
export default function ReverbPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("reverb");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="reverb" title="Reverb" description="Tambah efek reverb/echo" options={<ReverbOptions/>}/></div>);}
