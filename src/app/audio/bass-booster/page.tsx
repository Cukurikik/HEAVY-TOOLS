"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{BassBoosterOptions}from"@/modules/audio-studio/components/tools/BassBoosterOptions";
export default function BassBoosterPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("bass-booster");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="bass-booster" title="Bass Booster" description="Boost frekuensi rendah" options={<BassBoosterOptions/>}/></div>);}
