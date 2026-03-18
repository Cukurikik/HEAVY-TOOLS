"use client";

import { useParams, useRouter } from "next/navigation";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { VIDEO_TOOLS } from "@/modules/video-engine/constants/tools";
import { VideoOperation } from "@/modules/video-engine/types";
import { useEffect } from "react";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VideoToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.toolId as VideoOperation;
  const tool = VIDEO_TOOLS.find((t) => t.id === toolId);
  const { setOptions, task } = useVideoStore();

  useEffect(() => {
    if (!tool) {
      router.push("/video");
    }
  }, [tool, router]);

  if (!tool) return null;

  // Render specific options based on toolId
  const renderOptions = () => {
    switch (toolId) {
      case "converter":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Output Format</Label>
              <Select 
                defaultValue="mp4" 
                onValueChange={(val) => setOptions({ format: val })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                  <SelectItem value="avi">AVI (Xvid)</SelectItem>
                  <SelectItem value="mkv">MKV (Matroska)</SelectItem>
                  <SelectItem value="mov">MOV (QuickTime)</SelectItem>
                  <SelectItem value="webm">WebM (VP9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "compressor":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Compression Level (CRF)</Label>
                <span className="text-indigo-400 font-bold">{task.options?.crf || 28}</span>
              </div>
              <Slider 
                defaultValue={[28]} 
                min={18} 
                max={51} 
                step={1} 
                onValueChange={(val) => setOptions({ crf: val[0] })}
              />
              <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <span>Lossless (18)</span>
                <span>Low Quality (51)</span>
              </div>
            </div>
          </div>
        );
      case "cutter":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Start Time</Label>
                <Input 
                  type="text" 
                  defaultValue="00:00:00" 
                  className="bg-slate-800 border-slate-700 text-white" 
                  onChange={(e) => setOptions({ start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">End Time</Label>
                <Input 
                  type="text" 
                  defaultValue="00:00:10" 
                  className="bg-slate-800 border-slate-700 text-white" 
                  onChange={(e) => setOptions({ end: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case "speed":
        return (
          <div className="space-y-4">
            <Label className="text-slate-300">Playback Speed</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button 
                  key={s}
                  onClick={() => setOptions({ speed: s })}
                  className={`py-2 rounded-lg border text-xs transition-all ${
                    (task.options?.speed || 1.0) === s 
                      ? "bg-indigo-600 border-indigo-500 text-white" 
                      : "bg-slate-800 border-slate-700 text-white hover:bg-indigo-500/20"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        );
      case "rotate":
        return (
          <div className="space-y-4">
            <Label className="text-slate-300">Rotate Degrees</Label>
            <div className="grid grid-cols-3 gap-2">
              {["90", "180", "270"].map((d) => (
                <button 
                  key={d}
                  onClick={() => setOptions({ degrees: d })}
                  className={`py-2 rounded-lg border text-xs transition-all ${
                    (task.options?.degrees || "90") === d 
                      ? "bg-indigo-600 border-indigo-500 text-white" 
                      : "bg-slate-800 border-slate-700 text-white hover:bg-indigo-500/20"
                  }`}
                >
                  {d}°
                </button>
              ))}
            </div>
          </div>
        );
      case "crop":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Crop Width (e.g. iw/2)</Label>
                <Input 
                  type="text" 
                  defaultValue="iw/2" 
                  className="bg-slate-800 border-slate-700 text-white" 
                  onChange={(e) => setOptions({ width: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Crop Height (e.g. ih/2)</Label>
                <Input 
                  type="text" 
                  defaultValue="ih/2" 
                  className="bg-slate-800 border-slate-700 text-white" 
                  onChange={(e) => setOptions({ height: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case "resize":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Width</Label>
                <Input 
                  type="number" 
                  defaultValue="1280" 
                  className="bg-slate-800 border-slate-700 text-white" 
                  onChange={(e) => setOptions({ width: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Height</Label>
                <Input 
                  type="number" 
                  defaultValue="720" 
                  className="bg-slate-800 border-slate-700 text-white" 
                  onChange={(e) => setOptions({ height: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case "extract-audio":
        return (
          <div className="space-y-4">
            <Label className="text-slate-300">Audio Format</Label>
            <Select 
              defaultValue="mp3" 
              onValueChange={(val) => setOptions({ format: val })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
                <SelectItem value="aac">AAC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "filters":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Brightness</Label>
                <span className="text-indigo-400 font-bold">{task.options?.brightness || 0}</span>
              </div>
              <Slider 
                defaultValue={[0]} 
                min={-1} 
                max={1} 
                step={0.1} 
                onValueChange={(val) => setOptions({ brightness: val[0] })}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Contrast</Label>
                <span className="text-indigo-400 font-bold">{task.options?.contrast || 1}</span>
              </div>
              <Slider 
                defaultValue={[1]} 
                min={-2} 
                max={2} 
                step={0.1} 
                onValueChange={(val) => setOptions({ contrast: val[0] })}
              />
            </div>
          </div>
        );
      case "metadata":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Video Title</Label>
              <Input 
                type="text" 
                placeholder="Enter new title" 
                className="bg-slate-800 border-slate-700 text-white" 
                onChange={(e) => setOptions({ title: e.target.value })}
              />
            </div>
          </div>
        );
      case "watermark":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Watermark Text</Label>
              <Input 
                type="text" 
                defaultValue="OMNI-TOOL" 
                className="bg-slate-800 border-slate-700 text-white" 
                onChange={(e) => setOptions({ text: e.target.value })}
              />
            </div>
          </div>
        );
      case "hls-generator":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Segment Duration (seconds)</Label>
              <Input 
                type="number" 
                defaultValue="10" 
                className="bg-slate-800 border-slate-700 text-white" 
                onChange={(e) => setOptions({ segmentTime: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );
      case "subtitle":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Subtitle Text</Label>
              <Input 
                type="text" 
                placeholder="Enter subtitle text" 
                className="bg-slate-800 border-slate-700 text-white" 
                onChange={(e) => setOptions({ subtitleText: e.target.value })}
              />
            </div>
          </div>
        );
      case "upscaling":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold text-center">
              AI Upscaling will double the resolution using bicubic interpolation.
            </div>
          </div>
        );
      case "encryption":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              This will apply a noise bitstream filter as a basic encryption placeholder.
            </div>
          </div>
        );
      case "scene-detection":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
              Scene detection will analyze the video for significant visual changes.
            </div>
          </div>
        );
      case "screen-recorder":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold text-center">
              Use the browser's native screen capture API to record your desktop.
            </div>
            <button className="w-full py-3 rounded-xl bg-indigo-500 text-white text-xs font-black tracking-widest uppercase">
              Configure Capture
            </button>
          </div>
        );
      case "webcam-recorder":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold text-center">
              Record video directly from your connected camera.
            </div>
            <button className="w-full py-3 rounded-xl bg-purple-500 text-white text-xs font-black tracking-widest uppercase">
              Access Camera
            </button>
          </div>
        );
      case "downloader":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Video URL</Label>
              <Input 
                type="url" 
                placeholder="https://example.com/video.mp4" 
                className="bg-slate-800 border-slate-700 text-white" 
                onChange={(e) => setOptions({ url: e.target.value })}
              />
            </div>
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold text-center uppercase tracking-widest">
              Note: This tool requires a direct video link. YouTube/Vimeo links may not work due to CORS.
            </div>
          </div>
        );
      case "batch":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold text-center">
              Batch processing allows you to apply the same operation to multiple files. 
              (Coming soon in Phase 20)
            </div>
          </div>
        );
      case "auto-subtitle":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold text-center">
              AI-powered transcription will generate subtitles automatically.
              (Coming soon in Phase 20)
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 text-xs italic text-center">
            No specific options for this tool. Click process to continue.
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId={toolId}
        title={tool.name}
        description={tool.desc}
        options={renderOptions()}
      />
    </div>
  );
}
