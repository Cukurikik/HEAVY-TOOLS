"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{SpatialAudioOptions}from"@/modules/audio-studio/components/tools/SpatialAudioOptions";
export default function SpatialAudioPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("spatial-audio");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="spatial-audio" title="Spatial Audio" description="Konversi ke audio surround/3D" options={<SpatialAudioOptions/>}/></div>);}
