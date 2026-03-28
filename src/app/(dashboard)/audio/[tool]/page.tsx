import { AudioToolInterface } from "@/modules/audio-studio/components/AudioToolInterface";
import { AudioToolCommand } from "@/modules/audio-studio/core/command-matrix";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const AUDIO_TOOLS_DATA: Record<string, { title: string; description: string; isMulti?: boolean; isAnalyzer?: boolean }> = {
  'trimmer': { title: "Audio Trimmer", description: "Potong audio dengan presisi tinggi layaknya di DAW." },
  'merger': { title: "Audio Merger", description: "Gabungkan multiple audio track tanpa distorsi.", isMulti: true },
  'converter': { title: "Audio Converter", description: "Konversi lintas format MP3, WAV, OGG, M4A, AAC." },
  'mastering-hub': { title: "Mastering Hub", description: "Rantai kompresor, EQ, & limiter ala studio profesional." },
  'stem-splitter': { title: "Stem Splitter", description: "Pisahkan vokal dan instrumen dari track utuh via AI/DSP bias." },
  'pitch-shifter': { title: "Pitch Shifter", description: "Ubah pitch audio tanpa mendistorsi ritme aslinya." },
  'time-stretch': { title: "Time Stretch", description: "Percepat atau perlambat tempo tanpa mengubah nada dasar." },
  'noise-remover': { title: "Noise Remover", description: "Reduksi noise latar belakang (hum, hiss) dengan Fast Fourier." },
  'equalizer': { title: "10-Band Equalizer", description: "Atur rentang frekuensi secara spesifik dengan 10-Band Visual EQ." },
  'compressor': { title: "Compressor", description: "Ratakan dinamika volume dengan Threshold dan Ratio ekstrem." },
  'reverb': { title: "Reverb", description: "Tambahkan pantulan ruang/gema (Conclusive/Algorithmic reverb)." },
  'normalizer': { title: "Loudness Normalizer", description: "Standardisasi level volume ke standar streaming LUFS/True Peak." },
  'silence-remover': { title: "Silence Remover", description: "Hapus bagian kosong/jeda hening secara presisi otomatis." },
  'voice-isolator': { title: "Voice Isolator", description: "Ekstrak rentang frekuensi vokal manusia, tekan noise lingkungan." },
  'bass-booster': { title: "Bass Booster", description: "Tingkatkan kedalaman frekuensi Low-End menggunakan exciter sub-harmonics." },
  'stereo-panner': { title: "Stereo Panner", description: "Posisikan atau putar audio dalam dimensi Left-Right pan space." },
  'waveform-visualizer': { title: "Waveform Visualizer", description: "Render data audio menjadi video visualisasi gelombang.", isAnalyzer: true },
  'metadata-editor': { title: "Metadata Editor", description: "Ubah informasi teks pada audio (ID3 Tags, Album, Artis)." },
  'bpm-detector': { title: "BPM Detector", description: "Analisis dan ekstrak Beat Per Minute (Tempo) lagu asli.", isAnalyzer: true },
  'key-finder': { title: "Key Finder", description: "Kalkulasi nada dasar melodik utama dari file rekaman.", isAnalyzer: true },
  'batch-processor': { title: "Batch Processor", description: "Pemrosesan masal untuk multiple klip sekaligus.", isMulti: true },
  'audio-splitter': { title: "Audio Splitter", description: "Pecah direktori audio panjang menjadi klip-klip mandiri per bab." },
  'podcast-enhancer': { title: "Podcast Enhancer", description: "Filter siap pakai untuk jernihan vokal broadcasting (Gate+EQ+Comp)." },
  'voice-recorder': { title: "Pro Voice Recorder", description: "Rekam mikrofon murni langsung ke WAV/FLAC Browser Memory." },
  'spectrum-analyzer': { title: "Spectrum Analyzer", description: "Inspeksi frekuensi respons secara visual grafis menyeluruh.", isAnalyzer: true },
  'fade-editor': { title: "Fade Editor", description: "Bubuhkan transisi mulus Fade-In/Out atau Crossfade otomatis." },
  'loop-creator': { title: "Loop Creator", description: "Ciptakan putaran audio mulus tanpa celah retak/click." },
  'karaoke-maker': { title: "Karaoke Maker", description: "Redam center/vocal track menggunakan inversi fase presisi tinggi." },
  'spatial-audio': { title: "Spatial 8D Audio", description: "Konversi track stereo biasa menjadi arena suara Surround/Binaural." },
  'resampler': { title: "Audio Resampler", description: "Ubah kualitas sample rate (mis. 44100Hz -> 48000Hz) tanpa loss." },
};

export default async function AudioToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolConf = AUDIO_TOOLS_DATA[tool] || { title: "Audio Engine", description: "Advanced Client-Side DSP Processing" };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 text-sm text-zinc-400 font-medium mb-4">
        <Link href="/audio" className="hover:text-white transition-colors">Audio Studio</Link>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span className="text-violet-400 capitalize">{tool.replace(/-/g, ' ')}</span>
      </div>
      
      <AudioToolInterface 
        toolId={tool as AudioToolCommand} 
        title={toolConf.title}
        description={toolConf.description}
        isMultiFile={toolConf.isMulti}
        isAnalyzer={toolConf.isAnalyzer}
      />
    </div>
  );
}
