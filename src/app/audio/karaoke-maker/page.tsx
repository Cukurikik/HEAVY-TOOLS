"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{KaraokeMakerOptions}from"@/modules/audio-studio/components/tools/KaraokeMakerOptions";
export default function KaraokeMakerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("karaoke-maker");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="karaoke-maker" title="Karaoke Maker" description="Hapus vokal dari lagu" options={<KaraokeMakerOptions/>}/></div>);}
