"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{BatchProcessorOptions}from"@/modules/audio-studio/components/tools/BatchProcessorOptions";
export default function BatchProcessorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("batch-processor");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="batch-processor" title="Batch Processor" description="Proses multiple audio sekaligus" options={<BatchProcessorOptions/>} isMultiFile={true}/></div>);}
