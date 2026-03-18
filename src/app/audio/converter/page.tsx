"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{ConverterOptions}from"@/modules/audio-studio/components/tools/ConverterOptions";
export default function ConverterPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("converter");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="converter" title="Audio Converter" description="Konversi MP3/WAV/OGG/FLAC/AAC" options={<ConverterOptions/>}/></div>);}
