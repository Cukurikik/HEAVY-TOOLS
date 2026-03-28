import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const VIDEO_TOOLS_DATA: Record<string, { title: string; description: string; isMulti?: boolean }> = {
  'trimmer':              { title: "Video Trimmer", description: "Potong video presisi frame menggunakan seek -ss." },
  'merger':               { title: "Video Merger", description: "Gabungkan multiple video via concat protocol.", isMulti: true },
  'converter':            { title: "Video Converter", description: "Konversi format: MP4/WebM/MKV/MOV/AVI." },
  'compressor':           { title: "Video Compressor", description: "Kompresi dengan kontrol CRF dan Bitrate penuh." },
  'flipper':              { title: "Video Flipper", description: "Flip horizontal/vertical via hflip/vflip filter." },
  'rotator':              { title: "Video Rotator", description: "Rotasi 90°/180°/270° dengan re-encoding libx264." },
  'stabilizer':           { title: "Video Stabilizer", description: "Stabilisasi vidstabdetect + vidstabtransform." },
  'reverse':              { title: "Video Reverser", description: "Balik video frame-by-frame." },
  'speed-control':        { title: "Speed Controller", description: "Ubah kecepatan 0.25x – 4x via setpts filter." },
  'loop-engine':          { title: "Loop Engine", description: "Buat video loop dengan jumlah putaran kustom." },
  'pro-editor':           { title: "Pro Editor", description: "Editor lengkap: CRF, Bitrate, Codec, Profile." },
  'thumbnail-extractor':  { title: "Thumbnail Extractor", description: "Ekstrak frame sebagai gambar di timestamp tertentu." },
  'subtitle-burner':      { title: "Subtitle Burner", description: "Burn subtitle SRT/ASS ke dalam video." },
  'watermark':            { title: "Watermark Tool", description: "Tambah watermark gambar/teks dengan posisi kustom." },
  'noise-reducer':        { title: "Noise Reducer", description: "Kurangi noise visual via hqdn3d filter." },
  'color-grader':         { title: "Color Grader", description: "Koreksi warna: brightness, contrast, saturation, hue." },
  'resolution-upscaler':  { title: "AI Upscaler", description: "Upscale resolusi via ESRGAN/WASM AI model." },
  'frame-interpolator':   { title: "Frame Interpolator", description: "Tingkatkan FPS via minterpolate filter." },
  'gif-converter':        { title: "GIF Converter", description: "Konversi video ke GIF berkualitas tinggi dengan palette." },
  'hdr-tonemapper':       { title: "HDR Tonemapper", description: "Konversi HDR ke SDR via zscale + tonemap." },
  'black-white':          { title: "Black & White", description: "Konversi ke grayscale via hue=s=0 filter." },
  'slow-motion':          { title: "Slow Motion", description: "Slow motion up to 0.1x dengan frame interpolation." },
  'timelapse':            { title: "Timelapse Maker", description: "Buat timelapse dengan skip-frame algorithm." },
  'screen-recorder':      { title: "Screen Recorder", description: "Rekam layar via getDisplayMedia() API." },
  'metadata-editor':      { title: "Metadata Editor", description: "Edit title, author, copyright via FFmpeg metadata." },
  'batch-processor':      { title: "Batch Processor", description: "Proses multiple video sekaligus dengan antrian.", isMulti: true },
  'chapter-marker':       { title: "Chapter Marker", description: "Tambah chapter markers ke file MKV/MP4." },
  'audio-extractor':      { title: "Audio Extractor", description: "Ekstrak audio track dari video tanpa re-encoding." },
  'video-splitter':       { title: "Video Splitter", description: "Pecah video menjadi segmen berdasarkan waktu/ukuran." },
  'aspect-ratio':         { title: "Aspect Ratio Tool", description: "Ubah aspect ratio dengan crop atau letterbox." },
};

export default async function VideoToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolConf = VIDEO_TOOLS_DATA[tool] || { title: "Video Engine", description: "Advanced Client-Side WASM Video Processing" };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 text-sm text-zinc-400 font-medium mb-4">
        <Link href="/video" className="hover:text-white transition-colors">Video Tools</Link>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span className="text-cyan-400 capitalize">{tool.replace(/-/g, ' ')}</span>
      </div>
      
      <VideoToolInterface 
        toolId={tool as any}
        title={toolConf.title}
        description={toolConf.description}
        isMultiFile={toolConf.isMulti}
      />
    </div>
  );
}
