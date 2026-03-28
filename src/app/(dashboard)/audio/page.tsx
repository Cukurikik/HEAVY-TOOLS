import { Metadata } from 'next';
import Link from 'next/link';
import {
  Scissors, Merge, RefreshCw, Headphones, Split, Sliders, Timer, Volume2,
  SlidersHorizontal, Layers, Waves, BarChart3, VolumeX, Mic2, AudioLines,
  Music4, Activity, FileText, Clock, Piano, Box, SplitSquareVertical,
  Podcast, MicVocal, BarChart, Blend, Repeat, Music, Ear, Disc3, Zap, Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Audio Studio | Omni-Tool',
  description: '30 Professional Audio DSP Tools powered by FFmpeg WebAssembly — 100% Client-Side',
};

const CATEGORIES = [
  {
    label: 'Cut & Combine',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    tools: [
      { slug: 'trimmer', name: 'Audio Trimmer', desc: 'Millisecond-precision cutting', icon: Scissors, accent: 'text-emerald-400' },
      { slug: 'merger', name: 'Audio Merger', desc: 'Combine multiple tracks', icon: Merge, accent: 'text-emerald-400' },
      { slug: 'converter', name: 'Audio Converter', desc: 'MP3/WAV/OGG/FLAC/AAC', icon: RefreshCw, accent: 'text-emerald-400' },
      { slug: 'audio-splitter', name: 'Audio Splitter', desc: 'Split by time or silence', icon: SplitSquareVertical, accent: 'text-emerald-400' },
    ],
  },
  {
    label: 'DSP Processing',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    tools: [
      { slug: 'mastering-hub', name: 'Mastering Hub', desc: 'Compressor → Limiter → EQ chain', icon: SlidersHorizontal, accent: 'text-cyan-400' },
      { slug: 'equalizer', name: '10-Band EQ', desc: 'Parametric EQ with presets', icon: Sliders, accent: 'text-cyan-400' },
      { slug: 'compressor', name: 'Compressor', desc: 'Dynamic range compression', icon: Layers, accent: 'text-cyan-400' },
      { slug: 'normalizer', name: 'Normalizer', desc: 'Peak & LUFS normalization', icon: BarChart3, accent: 'text-cyan-400' },
      { slug: 'reverb', name: 'Reverb', desc: 'Room, hall, plate effects', icon: Waves, accent: 'text-cyan-400' },
      { slug: 'bass-booster', name: 'Bass Booster', desc: 'Low-frequency enhancement', icon: Volume2, accent: 'text-cyan-400' },
    ],
  },
  {
    label: 'AI & Separation',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    tools: [
      { slug: 'stem-splitter', name: 'AI Stem Splitter', desc: 'Vocals, drums, bass, instruments', icon: Split, accent: 'text-purple-400' },
      { slug: 'voice-isolator', name: 'Voice Isolator', desc: 'Extract speech from noise', icon: Mic2, accent: 'text-purple-400' },
      { slug: 'noise-remover', name: 'Noise Remover', desc: 'Intelligent background noise removal', icon: VolumeX, accent: 'text-purple-400' },
      { slug: 'karaoke-maker', name: 'Karaoke Maker', desc: 'Phase inversion vocal removal', icon: Music4, accent: 'text-purple-400' },
      { slug: 'silence-remover', name: 'Silence Remover', desc: 'Auto-detect and remove gaps', icon: AudioLines, accent: 'text-purple-400' },
    ],
  },
  {
    label: 'Time & Pitch',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    tools: [
      { slug: 'pitch-shifter', name: 'Pitch Shifter', desc: 'Shift pitch in semitones', icon: Activity, accent: 'text-amber-400' },
      { slug: 'time-stretch', name: 'Time Stretch', desc: 'Change tempo without pitch', icon: Timer, accent: 'text-amber-400' },
      { slug: 'fade-editor', name: 'Fade Editor', desc: 'Fade-in/out and crossfade', icon: Blend, accent: 'text-amber-400' },
      { slug: 'loop-creator', name: 'Loop Creator', desc: 'Seamless audio loops', icon: Repeat, accent: 'text-amber-400' },
      { slug: 'stereo-panner', name: 'Stereo Panner', desc: 'Left-right pan positioning', icon: Headphones, accent: 'text-amber-400' },
      { slug: 'spatial-audio', name: 'Spatial 8D Audio', desc: 'Surround and binaural panning', icon: Ear, accent: 'text-amber-400' },
    ],
  },
  {
    label: 'Analysis',
    color: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
    tools: [
      { slug: 'waveform-visualizer', name: 'Waveform Visualizer', desc: 'Audio waveform display', icon: Waves, accent: 'text-sky-400' },
      { slug: 'spectrum-analyzer', name: 'Spectrum Analyzer', desc: 'Real-time frequency graph', icon: BarChart, accent: 'text-sky-400' },
      { slug: 'bpm-detector', name: 'BPM Detector', desc: 'Auto-detect tempo', icon: Disc3, accent: 'text-sky-400' },
      { slug: 'key-finder', name: 'Key Finder', desc: 'Detect musical key and scale', icon: Music, accent: 'text-sky-400' },
    ],
  },
  {
    label: 'Studio Tools',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    tools: [
      { slug: 'podcast-enhancer', name: 'Podcast Enhancer', desc: 'Voice clarity + gate + comp', icon: Podcast, accent: 'text-rose-400' },
      { slug: 'voice-recorder', name: 'Voice Recorder', desc: 'Record mic to WAV/FLAC', icon: MicVocal, accent: 'text-rose-400' },
      { slug: 'metadata-editor', name: 'Metadata (ID3)', desc: 'Title, artist, album tags', icon: FileText, accent: 'text-rose-400' },
      { slug: 'batch-processor', name: 'Batch Processor', desc: 'Process multiple files', icon: Box, accent: 'text-rose-400' },
    ],
  },
];

export default function AudioHubPage() {
  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20 border border-emerald-500/20 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              FFmpeg DSP
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Audio Studio
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
            30 Professional Audio DSP Tools — mastering-grade processing, stem separation, and analysis directly in your browser.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400" /> Zero Latency</span>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-teal-400" /> Web Worker DSP</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> Lossless Output</span>
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
                  href={`/audio/${tool.slug}`}
                  className={`group flex items-start gap-4 p-5 bg-card/50 backdrop-blur-sm border ${cat.border} rounded-2xl hover:bg-gradient-to-br ${cat.color} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700/80 transition-colors">
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
