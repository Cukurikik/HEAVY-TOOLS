"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Pro Editor — Configuration Panel
 * Full codec/CRF/profile/preset/tune/pixfmt control
 */
export function ProEditorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Codec</Label>
        <Select defaultValue="libx264" onValueChange={(val) => setOptions({ codec: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="libx264">H.264 (libx264)</SelectItem>
            <SelectItem value="libx265">H.265 (libx265)</SelectItem>
            <SelectItem value="libvpx-vp9">VP9</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">CRF</Label>
          <span className="text-rose-400 font-black text-lg">{(task.options?.crf as number) || 23}</span>
        </div>
        <Slider defaultValue={[23]} min={0} max={51} step={1} onValueChange={(val) => setOptions({ crf: val[0] })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Profile</Label>
        <Select defaultValue="high" onValueChange={(val) => setOptions({ profile: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="baseline">Baseline</SelectItem>
            <SelectItem value="main">Main</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Preset</Label>
        <Select defaultValue="medium" onValueChange={(val) => setOptions({ preset: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="ultrafast">Ultrafast</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="slow">Slow</SelectItem>
            <SelectItem value="veryslow">Very Slow</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Tune</Label>
        <Select defaultValue="none" onValueChange={(val) => setOptions({ tune: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="film">Film</SelectItem>
            <SelectItem value="animation">Animation</SelectItem>
            <SelectItem value="grain">Grain</SelectItem>
            <SelectItem value="fastdecode">Fast Decode</SelectItem>
            <SelectItem value="zerolatency">Zero Latency</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Pixel Format</Label>
        <Select defaultValue="yuv420p" onValueChange={(val) => setOptions({ pixFmt: val })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="yuv420p">YUV 4:2:0 (Compatible)</SelectItem>
            <SelectItem value="yuv422p">YUV 4:2:2 (Pro)</SelectItem>
            <SelectItem value="yuv444p">YUV 4:4:4 (Maximum)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
