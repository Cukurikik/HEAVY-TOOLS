"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{VoiceRecorderOptions}from"@/modules/audio-studio/components/tools/VoiceRecorderOptions";
export default function VoiceRecorderPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("voice-recorder");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="voice-recorder" title="Voice Recorder" description="Rekam suara via microphone" options={<VoiceRecorderOptions/>} isRecorder={true}/></div>);}
