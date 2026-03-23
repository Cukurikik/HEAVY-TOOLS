"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Video Converter — Configuration Panel
 * Konversi format dengan kontrol codec, CRF, dan resolusi
 */
export function ConverterOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Output Format</Label>
        <Select defaultValue="mp4" onValueChange={(val) => setOptions({ format: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="mp4">MP4 (H.264)</SelectItem>
            <SelectItem value="webm">WebM (VP9)</SelectItem>
            <SelectItem value="mkv">MKV</SelectItem>
            <SelectItem value="mov">MOV</SelectItem>
            <SelectItem value="avi">AVI</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Quality (CRF)</Label>
          <span className="text-indigo-400 font-black text-lg">{(task.options?.crf as number) || 23}</span>
        </div>
        <Slider defaultValue={[23]} min={15} max={45} step={1} onValueChange={(val) => setOptions({ crf: val[0] })} />
        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Best Quality</span>
          <span>Smallest File</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Resolution</Label>
        <Select defaultValue="original" onValueChange={(val) => setOptions({ resolution: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="original">Original</SelectItem>
            <SelectItem value="1920:1080">1080p</SelectItem>
            <SelectItem value="1280:720">720p</SelectItem>
            <SelectItem value="854:480">480p</SelectItem>
            <SelectItem value="640:360">360p</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Audio Codec</Label>
        <Select defaultValue="aac" onValueChange={(val) => setOptions({ audioCodec: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="aac">AAC</SelectItem>
            <SelectItem value="libmp3lame">MP3</SelectItem>
            <SelectItem value="copy">Copy (No re-encode)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
