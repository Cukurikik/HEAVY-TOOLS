"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{WaveformVisualizerOptions}from"@/modules/audio-studio/components/tools/WaveformVisualizerOptions";
export default function WaveformVisualizerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("waveform-visualizer");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="waveform-visualizer" title="Waveform Visualizer" description="Visualisasi gelombang audio" options={<WaveformVisualizerOptions/>} isAnalyzer={true}/></div>);}
