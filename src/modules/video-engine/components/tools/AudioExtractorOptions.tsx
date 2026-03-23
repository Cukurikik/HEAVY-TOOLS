"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Audio Extractor — Configuration Panel
 * Extract audio with format, bitrate, and sample rate
 */
export function AudioExtractorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Audio Format</Label>
        <Select defaultValue="mp3" onValueChange={(val) => setOptions({ audioFormat: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="mp3">MP3</SelectItem>
            <SelectItem value="aac">AAC</SelectItem>
            <SelectItem value="wav">WAV (Lossless)</SelectItem>
            <SelectItem value="flac">FLAC (Lossless)</SelectItem>
            <SelectItem value="ogg">OGG Vorbis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Bitrate</Label>
        <Select defaultValue="192" onValueChange={(val) => setOptions({ audioBitrate: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="96">96 kbps</SelectItem>
            <SelectItem value="128">128 kbps</SelectItem>
            <SelectItem value="192">192 kbps</SelectItem>
            <SelectItem value="256">256 kbps</SelectItem>
            <SelectItem value="320">320 kbps</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Sample Rate</Label>
        <Select defaultValue="44100" onValueChange={(val) => setOptions({ sampleRate: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="22050">22050 Hz</SelectItem>
            <SelectItem value="44100">44100 Hz (CD)</SelectItem>
            <SelectItem value="48000">48000 Hz (Pro)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
