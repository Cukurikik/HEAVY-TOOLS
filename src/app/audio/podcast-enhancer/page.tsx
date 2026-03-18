"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{PodcastEnhancerOptions}from"@/modules/audio-studio/components/tools/PodcastEnhancerOptions";
export default function PodcastEnhancerPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("podcast-enhancer");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="podcast-enhancer" title="Podcast Enhancer" description="Enhance suara podcast profesional" options={<PodcastEnhancerOptions/>}/></div>);}
