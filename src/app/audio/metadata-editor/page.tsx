"use client";
import{useEffect}from"react";
import{AudioToolInterface}from"@/modules/audio-studio/components/AudioToolInterface";
import{useAudioStore}from"@/modules/audio-studio/store/useAudioStore";
import{MetadataEditorOptions}from"@/modules/audio-studio/components/tools/MetadataEditorOptions";
export default function MetadataEditorPage(){const{setOperation}=useAudioStore();useEffect(()=>{setOperation("metadata-editor");},[setOperation]);return(<div className="p-8"><AudioToolInterface toolId="metadata-editor" title="Metadata Editor" description="Edit ID3 tags" options={<MetadataEditorOptions/>}/></div>);}
