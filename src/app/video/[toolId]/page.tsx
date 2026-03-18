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
  SelectValue,
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

  const renderOptions = () => {
    switch (toolId) {
      // ═══════════════════════════════════════
      // 1. VIDEO TRIMMER
      // ═══════════════════════════════════════
      case "trimmer":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Start Time</Label>
                <Input
                  type="text"
                  defaultValue="00:00:00"
                  placeholder="HH:MM:SS"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                  onChange={(e) => setOptions({ start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">End Time</Label>
                <Input
                  type="text"
                  defaultValue="00:00:10"
                  placeholder="HH:MM:SS"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                  onChange={(e) => setOptions({ end: e.target.value })}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Frame-accurate seek with -ss flag
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 2. VIDEO MERGER
      // ═══════════════════════════════════════
      case "merger":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold text-center">
              Upload multiple video files using the dropzone. They will be concatenated in order.
            </div>
            <div className="text-slate-400 text-xs font-medium text-center">
              {task.files.length > 0 ? `${task.files.length} files loaded` : "No files added yet"}
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 3. VIDEO CONVERTER
      // ═══════════════════════════════════════
      case "converter":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Output Format</Label>
              <Select defaultValue="mp4" onValueChange={(val) => setOptions({ format: val })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                  <SelectItem value="webm">WebM (VP9)</SelectItem>
                  <SelectItem value="mkv">MKV (Matroska)</SelectItem>
                  <SelectItem value="mov">MOV (QuickTime)</SelectItem>
                  <SelectItem value="avi">AVI (Xvid)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 4. VIDEO COMPRESSOR
      // ═══════════════════════════════════════
      case "compressor":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">CRF Level</Label>
                <span className="text-indigo-400 font-black text-lg">{(task.options?.crf as number) || 28}</span>
              </div>
              <Slider
                defaultValue={[28]}
                min={18}
                max={51}
                step={1}
                onValueChange={(val) => setOptions({ crf: val[0] })}
              />
              <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                <span>🔥 High Quality</span>
                <span>📦 Small File</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Preset</Label>
              <Select defaultValue="medium" onValueChange={(val) => setOptions({ preset: val })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="ultrafast">Ultrafast</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="slow">Slow (Better Quality)</SelectItem>
                  <SelectItem value="veryslow">Very Slow (Best Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 5. VIDEO FLIPPER
      // ═══════════════════════════════════════
      case "flipper":
        return (
          <div className="space-y-4">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Flip Direction</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "horizontal", label: "↔ Horizontal" },
                { value: "vertical", label: "↕ Vertical" },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setOptions({ direction: d.value })}
                  className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                    (task.options?.direction || "horizontal") === d.value
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/30"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 6. VIDEO ROTATOR
      // ═══════════════════════════════════════
      case "rotator":
        return (
          <div className="space-y-4">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Rotation Angle</Label>
            <div className="grid grid-cols-3 gap-2">
              {["90", "180", "270"].map((d) => (
                <button
                  key={d}
                  onClick={() => setOptions({ degrees: d })}
                  className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                    (task.options?.degrees || "90") === d
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"
                  }`}
                >
                  {d}°
                </button>
              ))}
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 7. VIDEO STABILIZER
      // ═══════════════════════════════════════
      case "stabilizer":
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-2">
              <div className="text-emerald-400 font-black text-sm uppercase tracking-widest">Deshake Engine</div>
              <p className="text-emerald-300/60 text-xs font-medium leading-relaxed">
                Stabilizes shaky footage using FFmpeg deshake filter. Works best with mild to moderate camera shake.
              </p>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 8. VIDEO REVERSER
      // ═══════════════════════════════════════
      case "reverse":
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center space-y-2">
              <div className="text-purple-400 font-black text-sm uppercase tracking-widest">Reverse Engine</div>
              <p className="text-purple-300/60 text-xs font-medium leading-relaxed">
                Reverses both video and audio tracks frame-by-frame. Note: Large files may take longer to process.
              </p>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 9. SPEED CONTROLLER
      // ═══════════════════════════════════════
      case "speed-control":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Playback Speed</Label>
              <span className="text-indigo-400 font-black text-lg">{(task.options?.speed as number) || 1}x</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setOptions({ speed: s })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    (task.options?.speed || 1) === s
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 10. LOOP ENGINE
      // ═══════════════════════════════════════
      case "loop-engine":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Loop Count</Label>
              <span className="text-pink-400 font-black text-lg">{(task.options?.loops as number) || 3}x</span>
            </div>
            <Slider
              defaultValue={[3]}
              min={2}
              max={20}
              step={1}
              onValueChange={(val) => setOptions({ loops: val[0] })}
            />
            <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              <span>2 loops</span>
              <span>20 loops</span>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 11. PRO EDITOR
      // ═══════════════════════════════════════
      case "pro-editor":
        return (
          <div className="space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">CRF</Label>
                <span className="text-violet-400 font-black">{(task.options?.crf as number) || 23}</span>
              </div>
              <Slider
                defaultValue={[23]}
                min={0}
                max={51}
                step={1}
                onValueChange={(val) => setOptions({ crf: val[0] })}
              />
            </div>
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
          </div>
        );

      // ═══════════════════════════════════════
      // 12. THUMBNAIL EXTRACTOR
      // ═══════════════════════════════════════
      case "thumbnail-extractor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Timestamp</Label>
              <Input
                type="text"
                defaultValue="00:00:01"
                placeholder="HH:MM:SS"
                className="bg-slate-800 border-slate-700 text-white font-mono"
                onChange={(e) => setOptions({ timestamp: e.target.value })}
              />
            </div>
            <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 text-teal-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Output: High-quality JPEG thumbnail
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 13. SUBTITLE BURNER
      // ═══════════════════════════════════════
      case "subtitle-burner":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Subtitle Text</Label>
              <Input
                type="text"
                placeholder="Enter subtitle text..."
                className="bg-slate-800 border-slate-700 text-white"
                onChange={(e) => setOptions({ subtitleText: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Start</Label>
                <Input
                  type="text"
                  defaultValue="00:00:00,000"
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  onChange={(e) => setOptions({ subStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">End</Label>
                <Input
                  type="text"
                  defaultValue="00:00:10,000"
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  onChange={(e) => setOptions({ subEnd: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 14. WATERMARK TOOL
      // ═══════════════════════════════════════
      case "watermark":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Watermark Text</Label>
              <Input
                type="text"
                defaultValue="HEAVY-TOOLS"
                className="bg-slate-800 border-slate-700 text-white"
                onChange={(e) => setOptions({ text: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Position X</Label>
                <Input
                  type="text"
                  defaultValue="10"
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  onChange={(e) => setOptions({ posX: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Position Y</Label>
                <Input
                  type="text"
                  defaultValue="10"
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  onChange={(e) => setOptions({ posY: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Font Size</Label>
                <Input
                  type="number"
                  defaultValue="24"
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  onChange={(e) => setOptions({ fontSize: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Color</Label>
                <Select defaultValue="white" onValueChange={(val) => setOptions({ fontColor: val })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="cyan">Cyan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 15. NOISE REDUCER
      // ═══════════════════════════════════════
      case "noise-reducer":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Denoise Strength</Label>
              <span className="text-slate-400 font-black">{(task.options?.strength as string) || "7"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["3", "5", "7", "10", "15", "20"].map((s) => (
                <button
                  key={s}
                  onClick={() => setOptions({ strength: s })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    (task.options?.strength || "7") === s
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              <span>Light</span>
              <span>Aggressive</span>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 16. COLOR GRADER
      // ═══════════════════════════════════════
      case "color-grader":
        return (
          <div className="space-y-5">
            {[
              { key: "brightness", label: "Brightness", min: -1, max: 1, step: 0.05, def: 0 },
              { key: "contrast", label: "Contrast", min: 0, max: 3, step: 0.1, def: 1 },
              { key: "saturation", label: "Saturation", min: 0, max: 3, step: 0.1, def: 1 },
              { key: "hue", label: "Hue Shift", min: 0, max: 360, step: 1, def: 0 },
            ].map((ctrl) => (
              <div key={ctrl.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">{ctrl.label}</Label>
                  <span className="text-rose-400 font-black">{(task.options?.[ctrl.key] as number) ?? ctrl.def}</span>
                </div>
                <Slider
                  defaultValue={[ctrl.def]}
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  onValueChange={(val) => setOptions({ [ctrl.key]: val[0] })}
                />
              </div>
            ))}
          </div>
        );

      // ═══════════════════════════════════════
      // 17. AI UPSCALER
      // ═══════════════════════════════════════
      case "resolution-upscaler":
        return (
          <div className="space-y-4">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Scale Factor</Label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setOptions({ scale: s })}
                  className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                    (task.options?.scale || 2) === s
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-yellow-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Uses bicubic interpolation for upscaling
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 18. FRAME INTERPOLATOR
      // ═══════════════════════════════════════
      case "frame-interpolator":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Target FPS</Label>
              <span className="text-fuchsia-400 font-black text-lg">{(task.options?.fps as number) || 60}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((f) => (
                <button
                  key={f}
                  onClick={() => setOptions({ fps: f })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    (task.options?.fps || 60) === f
                      ? "bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-fuchsia-500/10"
                  }`}
                >
                  {f} FPS
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-fuchsia-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Minterpolate MCI algorithm
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 19. GIF CONVERTER
      // ═══════════════════════════════════════
      case "gif-converter":
        return (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">FPS</Label>
                <span className="text-lime-400 font-black">{(task.options?.fps as number) || 10}</span>
              </div>
              <Slider
                defaultValue={[10]}
                min={5}
                max={30}
                step={1}
                onValueChange={(val) => setOptions({ fps: val[0] })}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Max Width</Label>
                <span className="text-lime-400 font-black">{(task.options?.scale as number) || 480}px</span>
              </div>
              <Slider
                defaultValue={[480]}
                min={200}
                max={800}
                step={20}
                onValueChange={(val) => setOptions({ scale: val[0] })}
              />
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 20. HDR TONEMAPPER
      // ═══════════════════════════════════════
      case "hdr-tonemapper":
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/10 text-center space-y-2">
              <div className="text-orange-400 font-black text-sm uppercase tracking-widest">HDR → SDR Conversion</div>
              <p className="text-orange-300/60 text-xs font-medium leading-relaxed">
                Converts HDR video to SDR using Hable tonemap algorithm with BT.709 color space conversion.
              </p>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 21. BLACK & WHITE
      // ═══════════════════════════════════════
      case "black-white":
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gray-500/5 border border-gray-500/10 text-center space-y-2">
              <div className="text-gray-300 font-black text-sm uppercase tracking-widest">Grayscale Filter</div>
              <p className="text-gray-400/60 text-xs font-medium leading-relaxed">
                Converts video to black & white using hue saturation filter (hue=s=0). Audio is preserved.
              </p>
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 22. SLOW MOTION
      // ═══════════════════════════════════════
      case "slow-motion":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Slow Factor</Label>
              <span className="text-blue-400 font-black text-lg">{(task.options?.factor as number) || 0.5}x</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0.1, 0.25, 0.5, 0.75].map((f) => (
                <button
                  key={f}
                  onClick={() => setOptions({ factor: f })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    (task.options?.factor || 0.5) === f
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-blue-500/10"
                  }`}
                >
                  {f}x
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Audio will be removed for extreme slow-mo
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 23. TIMELAPSE MAKER
      // ═══════════════════════════════════════
      case "timelapse":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Speed Multiplier</Label>
              <span className="text-green-400 font-black text-lg">{(task.options?.speed as number) || 10}x</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 50, 100].map((s) => (
                <button
                  key={s}
                  onClick={() => setOptions({ speed: s })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    (task.options?.speed || 10) === s
                      ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-green-500/10"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 24. SCREEN RECORDER
      // ═══════════════════════════════════════
      case "screen-recorder":
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10 text-center space-y-2">
              <div className="text-red-400 font-black text-sm uppercase tracking-widest">Browser Capture API</div>
              <p className="text-red-300/60 text-xs font-medium leading-relaxed">
                Uses getDisplayMedia() to capture your screen. Click START ENGINE to begin recording. Click &quot;Stop sharing&quot; in your browser to finish.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              No file upload needed — direct capture
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 25. METADATA EDITOR
      // ═══════════════════════════════════════
      case "metadata-editor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Title</Label>
              <Input
                type="text"
                placeholder="Video title..."
                className="bg-slate-800 border-slate-700 text-white"
                onChange={(e) => setOptions({ title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Author</Label>
              <Input
                type="text"
                placeholder="Author name..."
                className="bg-slate-800 border-slate-700 text-white"
                onChange={(e) => setOptions({ author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Copyright</Label>
              <Input
                type="text"
                placeholder="© 2026 ..."
                className="bg-slate-800 border-slate-700 text-white"
                onChange={(e) => setOptions({ copyright: e.target.value })}
              />
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 26. BATCH PROCESSOR
      // ═══════════════════════════════════════
      case "batch-processor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Batch Operation</Label>
              <Select defaultValue="compress" onValueChange={(val) => setOptions({ batchOperation: val })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="compress">Compress (H.264)</SelectItem>
                  <SelectItem value="grayscale">Convert to Grayscale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(task.options?.batchOperation || "compress") === "compress" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">CRF</Label>
                  <span className="text-purple-400 font-black">{(task.options?.batchCrf as number) || 28}</span>
                </div>
                <Slider
                  defaultValue={[28]}
                  min={18}
                  max={51}
                  step={1}
                  onValueChange={(val) => setOptions({ batchCrf: val[0] })}
                />
              </div>
            )}
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-purple-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Upload multiple files to batch process
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 27. CHAPTER MARKER
      // ═══════════════════════════════════════
      case "chapter-marker":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Chapters</Label>
              <textarea
                defaultValue={"00:00:00=Intro\n00:01:00=Chapter 1\n00:05:00=Chapter 2"}
                className="w-full h-32 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="HH:MM:SS=Title (one per line)"
                onChange={(e) => setOptions({ chapters: e.target.value })}
              />
            </div>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Format: HH:MM:SS=Chapter Title
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 28. AUDIO EXTRACTOR
      // ═══════════════════════════════════════
      case "audio-extractor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Output Format</Label>
              <Select defaultValue="mp3" onValueChange={(val) => setOptions({ format: val })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="wav">WAV (Lossless)</SelectItem>
                  <SelectItem value="aac">AAC</SelectItem>
                  <SelectItem value="flac">FLAC</SelectItem>
                  <SelectItem value="ogg">OGG Vorbis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/5 border border-pink-500/10 text-pink-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Extracts audio track without video re-encoding
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 29. VIDEO SPLITTER
      // ═══════════════════════════════════════
      case "video-splitter":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Segment Duration (sec)</Label>
              <span className="text-sky-400 font-black text-lg">{(task.options?.segmentDuration as number) || 30}s</span>
            </div>
            <Slider
              defaultValue={[30]}
              min={5}
              max={300}
              step={5}
              onValueChange={(val) => setOptions({ segmentDuration: val[0] })}
            />
            <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              <span>5 sec</span>
              <span>5 min</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/10 text-sky-400/70 text-[10px] font-bold text-center uppercase tracking-widest">
              Downloads first segment as preview
            </div>
          </div>
        );

      // ═══════════════════════════════════════
      // 30. ASPECT RATIO TOOL
      // ═══════════════════════════════════════
      case "aspect-ratio":
        return (
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Aspect Ratio</Label>
              <div className="grid grid-cols-2 gap-2">
                {["16:9", "4:3", "1:1", "9:16"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setOptions({ ratio: r })}
                    className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                      (task.options?.ratio || "16:9") === r
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "crop", label: "✂️ Crop" },
                  { value: "letterbox", label: "📐 Letterbox" },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setOptions({ mode: m.value })}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      (task.options?.mode || "crop") === m.value
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-500/10"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 text-xs italic text-center">
            No specific options for this tool. Click START ENGINE to process.
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
        isScreenRecorder={toolId === "screen-recorder"}
        isMultiFile={toolId === "merger" || toolId === "batch-processor"}
      />
    </div>
  );
}
