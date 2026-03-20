import { VideoToolDefinition } from '../types';

export const VIDEO_TOOLS: VideoToolDefinition[] = [
  {
    id: 'trimmer',
    name: 'Video Trimmer',
    description: 'Potong video presisi frame menggunakan seek -ss',
    icon: 'Scissors',
    gradient: 'from-blue-500 to-cyan-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'merger',
    name: 'Video Merger',
    description: 'Gabungkan multiple video via concat protocol',
    icon: 'Merge',
    gradient: 'from-indigo-500 to-purple-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'converter',
    name: 'Video Converter',
    description: 'Konversi format: MP4/WebM/MKV/MOV/AVI',
    icon: 'RefreshCw',
    gradient: 'from-green-500 to-emerald-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'compressor',
    name: 'Video Compressor',
    description: 'Kompresi dengan kontrol CRF dan Bitrate penuh',
    icon: 'Minimize2',
    gradient: 'from-red-500 to-rose-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'flipper',
    name: 'Video Flipper',
    description: 'Flip horizontal/vertical via hflip/vflip filter',
    icon: 'FlipHorizontal',
    gradient: 'from-orange-500 to-amber-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'rotator',
    name: 'Video Rotator',
    description: 'Rotasi 90°/180°/270° dengan re-encoding libx264',
    icon: 'RotateCw',
    gradient: 'from-yellow-400 to-yellow-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'stabilizer',
    name: 'Video Stabilizer',
    description: 'Stabilisasi vidstabdetect + vidstabtransform',
    icon: 'Camera',
    gradient: 'from-teal-500 to-emerald-500',
    engine: 'Server child_process',
    execution: 'Server'
  },
  {
    id: 'reverse',
    name: 'Video Reverser',
    description: 'Balik video frame-by-frame',
    icon: 'History',
    gradient: 'from-pink-500 to-rose-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'speed-control',
    name: 'Speed Controller',
    description: 'Ubah kecepatan 0.25x – 4x via setpts filter',
    icon: 'FastForward',
    gradient: 'from-sky-500 to-blue-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'loop-engine',
    name: 'Loop Engine',
    description: 'Buat video loop dengan jumlah putaran kustom',
    icon: 'Repeat',
    gradient: 'from-fuchsia-500 to-purple-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'pro-editor',
    name: 'Pro Editor',
    description: 'Editor lengkap: CRF, Bitrate, Codec, Profile',
    icon: 'Sliders',
    gradient: 'from-violet-600 to-indigo-700',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'thumbnail-extractor',
    name: 'Thumbnail Extractor',
    description: 'Ekstrak frame sebagai gambar di timestamp tertentu',
    icon: 'Image',
    gradient: 'from-amber-500 to-orange-500',
    engine: 'Canvas API',
    execution: 'Client'
  },
  {
    id: 'subtitle-burner',
    name: 'Subtitle Burner',
    description: 'Burn subtitle SRT/ASS ke dalam video',
    icon: 'Subtitles',
    gradient: 'from-sky-500 to-indigo-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'watermark',
    name: 'Watermark Tool',
    description: 'Tambah watermark gambar/teks dengan posisi kustom',
    icon: 'Stamp',
    gradient: 'from-blue-600 to-indigo-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'noise-reducer',
    name: 'Noise Reducer',
    description: 'Kurangi noise visual via hqdn3d filter',
    icon: 'Wand2',
    gradient: 'from-violet-500 to-purple-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'color-grader',
    name: 'Color Grader',
    description: 'Koreksi warna: brightness, contrast, saturation, hue',
    icon: 'Palette',
    gradient: 'from-rose-400 to-pink-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'resolution-upscaler',
    name: 'AI Upscaler',
    description: 'Upscale resolusi via ESRGAN/WASM AI model',
    icon: 'Sparkles',
    gradient: 'from-amber-400 to-yellow-600',
    engine: 'TensorFlow WebGPU',
    execution: 'Client'
  },
  {
    id: 'frame-interpolator',
    name: 'Frame Interpolator',
    description: 'Tingkatkan FPS via minterpolate filter',
    icon: 'Layers',
    gradient: 'from-cyan-500 to-blue-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'gif-converter',
    name: 'GIF Converter',
    description: 'Konversi video ke GIF berkualitas tinggi dengan palette',
    icon: 'Film',
    gradient: 'from-fuchsia-600 to-pink-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'hdr-tonemapper',
    name: 'HDR Tonemapper',
    description: 'Konversi HDR ke SDR via zscale + tonemap',
    icon: 'Sun',
    gradient: 'from-orange-500 to-red-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'black-white',
    name: 'Black & White',
    description: 'Konversi ke grayscale via hue=s=0 filter',
    icon: 'Moon',
    gradient: 'from-slate-400 to-zinc-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'slow-motion',
    name: 'Slow Motion',
    description: 'Slow motion up to 0.1x dengan frame interpolation',
    icon: 'Turtle',
    gradient: 'from-emerald-400 to-teal-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'timelapse',
    name: 'Timelapse Maker',
    description: 'Buat timelapse dengan skip-frame algorithm',
    icon: 'Timer',
    gradient: 'from-yellow-500 to-orange-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'screen-recorder',
    name: 'Screen Recorder',
    description: 'Rekam layar via getDisplayMedia() API',
    icon: 'Monitor',
    gradient: 'from-blue-400 to-indigo-500',
    engine: 'MediaRecorder API',
    execution: 'Client'
  },
  {
    id: 'metadata-editor',
    name: 'Metadata Editor',
    description: 'Edit title, author, copyright via FFmpeg metadata',
    icon: 'Tag',
    gradient: 'from-purple-500 to-violet-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'batch-processor',
    name: 'Batch Processor',
    description: 'Proses multiple video sekaligus dengan antrian',
    icon: 'ListChecks',
    gradient: 'from-emerald-500 to-cyan-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'chapter-marker',
    name: 'Chapter Marker',
    description: 'Tambah chapter markers ke file MKV/MP4',
    icon: 'Bookmark',
    gradient: 'from-red-400 to-rose-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'audio-extractor',
    name: 'Audio Extractor',
    description: 'Ekstrak audio track dari video tanpa re-encoding',
    icon: 'Music',
    gradient: 'from-pink-400 to-rose-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'video-splitter',
    name: 'Video Splitter',
    description: 'Pecah video menjadi segmen berdasarkan waktu/ukuran',
    icon: 'SplitSquareHorizontal',
    gradient: 'from-indigo-400 to-blue-600',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  },
  {
    id: 'aspect-ratio',
    name: 'Aspect Ratio Tool',
    description: 'Ubah aspect ratio dengan crop atau letterbox',
    icon: 'Maximize',
    gradient: 'from-cyan-400 to-teal-500',
    engine: 'FFmpeg WASM',
    execution: 'Client'
  }
];
