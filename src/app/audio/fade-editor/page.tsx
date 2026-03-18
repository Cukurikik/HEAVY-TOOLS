"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{FadeEditorOptions}from"@/modules/audio-studio/components/tools/FadeEditorOptions";
export default function FadeEditorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("fade-editor");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="fade-editor" title="Fade Editor" description="Fade in/out dengan kurva kustom" options={<FadeEditorOptions/>}/></div>);}
