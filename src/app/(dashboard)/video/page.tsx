import { Metadata } from 'next';
import Link from 'next/link';
import {
  Scissors, Merge, RefreshCw, Minimize2, FlipHorizontal, RotateCw,
  Anchor, Rewind, Gauge, Repeat, Film, Image, Subtitles, Stamp,
  Sparkles, Palette, ArrowUpCircle, Layers, FileImage, Sun,
  Contrast, Timer, Clock, Monitor, FileText, Box, Bookmark,
  Music, SplitSquareVertical, Ratio, Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Video Engine | Omni-Tool',
  description: '30 Professional Video Tools powered by FFmpeg WebAssembly — 100% Client-Side',
};

const CATEGORIES = [
  {
    label: 'Cut & Combine',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    tools: [
      { slug: 'trimmer', name: 'Video Trimmer', desc: 'Frame-accurate cutting with seek precision', icon: Scissors, accent: 'text-violet-400' },
      { slug: 'merger', name: 'Video Merger', desc: 'Combine multiple videos via concat protocol', icon: Merge, accent: 'text-violet-400' },
      { slug: 'video-splitter', name: 'Video Splitter', desc: 'Split video by time or file size', icon: SplitSquareVertical, accent: 'text-violet-400' },
      { slug: 'audio-extractor', name: 'Audio Extractor', desc: 'Extract audio track without re-encoding', icon: Music, accent: 'text-violet-400' },
    ],
  },
  {
    label: 'Transform',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    tools: [
      { slug: 'converter', name: 'Format Converter', desc: 'MP4/WebM/MKV/MOV/AVI', icon: RefreshCw, accent: 'text-blue-400' },
      { slug: 'compressor', name: 'Compressor', desc: 'CRF and bitrate controlled', icon: Minimize2, accent: 'text-blue-400' },
      { slug: 'flipper', name: 'Flipper', desc: 'Horizontal/vertical flip', icon: FlipHorizontal, accent: 'text-blue-400' },
      { slug: 'rotator', name: 'Rotator', desc: 'Rotate 90°/180°/270°', icon: RotateCw, accent: 'text-blue-400' },
      { slug: 'aspect-ratio', name: 'Aspect Ratio', desc: 'Crop or letterbox any ratio', icon: Ratio, accent: 'text-blue-400' },
    ],
  },
  {
    label: 'Speed & Time',
    color: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    tools: [
      { slug: 'speed-control', name: 'Speed Controller', desc: '0.25x – 4x via setpts filter', icon: Gauge, accent: 'text-emerald-400' },
      { slug: 'slow-motion', name: 'Slow Motion', desc: 'Up to 0.1x with interpolation', icon: Timer, accent: 'text-emerald-400' },
      { slug: 'timelapse', name: 'Timelapse Maker', desc: 'Skip-frame algorithm', icon: Clock, accent: 'text-emerald-400' },
      { slug: 'reverse', name: 'Reverser', desc: 'Reverse frame-by-frame', icon: Rewind, accent: 'text-emerald-400' },
      { slug: 'loop-engine', name: 'Loop Engine', desc: 'Custom repeat count', icon: Repeat, accent: 'text-emerald-400' },
      { slug: 'frame-interpolator', name: 'Frame Interpolator', desc: 'Increase FPS via minterpolate', icon: Layers, accent: 'text-emerald-400' },
    ],
  },
  {
    label: 'Visual Effects',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    tools: [
      { slug: 'stabilizer', name: 'Stabilizer', desc: 'Vidstab transform', icon: Anchor, accent: 'text-pink-400' },
      { slug: 'noise-reducer', name: 'Noise Reducer', desc: 'hqdn3d filter', icon: Sparkles, accent: 'text-pink-400' },
      { slug: 'color-grader', name: 'Color Grader', desc: 'Brightness, contrast, saturation, hue', icon: Palette, accent: 'text-pink-400' },
      { slug: 'resolution-upscaler', name: 'AI Upscaler', desc: 'ESRGAN WASM upscale', icon: ArrowUpCircle, accent: 'text-pink-400' },
      { slug: 'hdr-tonemapper', name: 'HDR Tonemapper', desc: 'HDR to SDR via tonemap', icon: Sun, accent: 'text-pink-400' },
      { slug: 'black-white', name: 'Black & White', desc: 'Grayscale via hue filter', icon: Contrast, accent: 'text-pink-400' },
    ],
  },
  {
    label: 'Overlay & Export',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    tools: [
      { slug: 'subtitle-burner', name: 'Subtitle Burner', desc: 'Burn SRT/ASS subtitles', icon: Subtitles, accent: 'text-amber-400' },
      { slug: 'watermark', name: 'Watermark', desc: 'Image/text with positioning', icon: Stamp, accent: 'text-amber-400' },
      { slug: 'thumbnail-extractor', name: 'Thumbnail Extractor', desc: 'Extract frames as images', icon: Image, accent: 'text-amber-400' },
      { slug: 'gif-converter', name: 'GIF Converter', desc: 'High-quality with palette', icon: FileImage, accent: 'text-amber-400' },
      { slug: 'chapter-marker', name: 'Chapter Marker', desc: 'MKV/MP4 chapters', icon: Bookmark, accent: 'text-amber-400' },
      { slug: 'metadata-editor', name: 'Metadata Editor', desc: 'Title, author, copyright', icon: FileText, accent: 'text-amber-400' },
    ],
  },
  {
    label: 'Studio',
    color: 'from-indigo-500/20 to-violet-500/20',
    border: 'border-indigo-500/30',
    tools: [
      { slug: 'pro-editor', name: 'Pro Editor', desc: 'Full CRF, Codec, Profile control', icon: Film, accent: 'text-indigo-400' },
      { slug: 'screen-recorder', name: 'Screen Recorder', desc: 'getDisplayMedia API', icon: Monitor, accent: 'text-indigo-400' },
      { slug: 'batch-processor', name: 'Batch Processor', desc: 'Process queue', icon: Box, accent: 'text-indigo-400' },
    ],
  },
];

export default function VideoHubPage() {
  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-violet-600/20 border border-indigo-500/20 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase">
              FFmpeg WASM
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
            Video Engine
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
            30 Professional Video Processing Tools powered by FFmpeg WebAssembly. All processing runs 100% locally in your browser — zero uploads, zero cloud dependency.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-400" /> 120 FPS UI Thread</span>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /> Multi-threaded WASM</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-400" /> SharedArrayBuffer</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <div key={cat.label} className="space-y-4">
          <h2 className="text-lg font-bold text-slate-300 tracking-wide uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color.replace('/20', '')}`} />
            {cat.label}
            <span className="text-xs text-slate-600 font-normal normal-case ml-2">({cat.tools.length} tools)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/video/${tool.slug}`}
                  className={`group flex items-start gap-4 p-5 bg-card/50 backdrop-blur-sm border ${cat.border} rounded-2xl hover:bg-gradient-to-br ${cat.color} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700/80 transition-colors`}>
                    <Icon className={`w-5 h-5 ${tool.accent} transition-colors`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-white transition-colors truncate">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
