"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{SpectrumAnalyzerOptions}from"@/modules/audio-studio/components/tools/SpectrumAnalyzerOptions";
export default function SpectrumAnalyzerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("spectrum-analyzer");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="spectrum-analyzer" title="Spectrum Analyzer" description="Analisis spektrum frekuensi" options={<SpectrumAnalyzerOptions/>} isAnalyzer={true}/></div>);}
