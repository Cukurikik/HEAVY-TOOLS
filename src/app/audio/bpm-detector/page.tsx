"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{BpmDetectorOptions}from"@/modules/audio-studio/components/tools/BpmDetectorOptions";
export default function BpmDetectorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("bpm-detector");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="bpm-detector" title="BPM Detector" description="Deteksi tempo otomatis via FFT" options={<BpmDetectorOptions/>} isAnalyzer={true}/></div>);}
