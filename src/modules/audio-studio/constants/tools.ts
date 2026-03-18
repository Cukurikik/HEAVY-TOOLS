import { AudioOperation } from "../types";

export interface AudioToolDef {
  id: AudioOperation;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

export const AUDIO_TOOLS: AudioToolDef[] = [
  { id: "trimmer", name: "Audio Trimmer", desc: "Potong audio presisi millisecond", icon: "Scissors", color: "from-blue-600 to-cyan-600" },
  { id: "merger", name: "Audio Merger", desc: "Gabungkan multiple audio track", icon: "Combine", color: "from-emerald-600 to-teal-600" },
  { id: "converter", name: "Audio Converter", desc: "Konversi MP3/WAV/OGG/FLAC/AAC", icon: "FileAudio", color: "from-violet-600 to-purple-600" },
  { id: "mastering-hub", name: "Mastering Hub", desc: "Rantai Compressor→Limiter→EQ profesional", icon: "Sliders", color: "from-amber-600 to-orange-600" },
  { id: "stem-splitter", name: "AI Stem Splitter", desc: "Pisahkan vokal, drum, bass, instrumen", icon: "Split", color: "from-pink-600 to-rose-600" },
  { id: "pitch-shifter", name: "Pitch Shifter", desc: "Ubah pitch ±24 semitone", icon: "TrendingUp", color: "from-indigo-600 to-blue-600" },
  { id: "time-stretch", name: "Time Stretch", desc: "Ubah tempo tanpa ubah pitch", icon: "Clock", color: "from-fuchsia-600 to-pink-600" },
  { id: "noise-remover", name: "Noise Remover", desc: "Hapus noise via afftdn filter", icon: "VolumeX", color: "from-red-600 to-rose-600" },
  { id: "equalizer", name: "Equalizer", desc: "10-band parametric EQ", icon: "BarChart3", color: "from-cyan-600 to-blue-600" },
  { id: "compressor", name: "Audio Compressor", desc: "Dynamic range compression", icon: "Gauge", color: "from-orange-600 to-red-600" },
  { id: "reverb", name: "Reverb", desc: "Tambah efek reverb/echo", icon: "Waves", color: "from-teal-600 to-emerald-600" },
  { id: "normalizer", name: "Normalizer", desc: "Normalisasi volume via loudnorm", icon: "Activity", color: "from-lime-600 to-green-600" },
  { id: "silence-remover", name: "Silence Remover", desc: "Hapus bagian hening otomatis", icon: "Eraser", color: "from-yellow-600 to-amber-600" },
  { id: "voice-isolator", name: "Voice Isolator", desc: "Isolasi vokal dari instrumen", icon: "Mic", color: "from-purple-600 to-violet-600" },
  { id: "bass-booster", name: "Bass Booster", desc: "Boost frekuensi rendah", icon: "Speaker", color: "from-stone-600 to-slate-600" },
  { id: "stereo-panner", name: "Stereo Panner", desc: "Atur posisi stereo L/R", icon: "MoveHorizontal", color: "from-sky-600 to-blue-600" },
  { id: "waveform-visualizer", name: "Waveform Visualizer", desc: "Visualisasi gelombang audio real-time", icon: "AudioWaveform", color: "from-green-600 to-emerald-600" },
  { id: "metadata-editor", name: "Metadata Editor", desc: "Edit ID3 tags (title, artist, album)", icon: "Tag", color: "from-slate-600 to-gray-600" },
  { id: "bpm-detector", name: "BPM Detector", desc: "Deteksi tempo otomatis via FFT", icon: "Heart", color: "from-rose-600 to-pink-600" },
  { id: "key-finder", name: "Key Finder", desc: "Deteksi key/nada dasar lagu", icon: "Key", color: "from-amber-600 to-yellow-600" },
  { id: "batch-processor", name: "Batch Processor", desc: "Proses multiple audio sekaligus", icon: "Layers", color: "from-blue-600 to-indigo-600" },
  { id: "audio-splitter", name: "Audio Splitter", desc: "Pecah audio berdasarkan waktu", icon: "Scissors", color: "from-red-600 to-orange-600" },
  { id: "podcast-enhancer", name: "Podcast Enhancer", desc: "Enhance suara podcast profesional", icon: "Podcast", color: "from-violet-600 to-indigo-600" },
  { id: "voice-recorder", name: "Voice Recorder", desc: "Rekam suara via microphone", icon: "Mic2", color: "from-red-600 to-rose-600" },
  { id: "spectrum-analyzer", name: "Spectrum Analyzer", desc: "Analisis spektrum frekuensi real-time", icon: "BarChart", color: "from-cyan-600 to-teal-600" },
  { id: "fade-editor", name: "Fade Editor", desc: "Fade in/out dengan kurva kustom", icon: "Sunset", color: "from-orange-600 to-amber-600" },
  { id: "loop-creator", name: "Loop Creator", desc: "Buat audio loop seamless", icon: "Repeat", color: "from-pink-600 to-fuchsia-600" },
  { id: "karaoke-maker", name: "Karaoke Maker", desc: "Hapus vokal dari lagu", icon: "Music", color: "from-purple-600 to-pink-600" },
  { id: "spatial-audio", name: "Spatial Audio", desc: "Konversi ke audio surround/3D", icon: "Headphones", color: "from-indigo-600 to-violet-600" },
  { id: "audio-recorder", name: "Audio Recorder", desc: "Rekam audio sistem + mikrofon", icon: "Circle", color: "from-red-600 to-red-700" },
];
