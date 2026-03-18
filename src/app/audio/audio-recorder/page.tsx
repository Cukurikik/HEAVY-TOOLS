"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{AudioRecorderOptions}from"@/modules/audio-studio/components/tools/AudioRecorderOptions";
export default function AudioRecorderPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("audio-recorder");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="audio-recorder" title="Audio Recorder" description="Rekam audio sistem + mikrofon" options={<AudioRecorderOptions/>} isRecorder={true}/></div>);}
