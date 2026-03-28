import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Image Matrix Tools | Omni-Tool',
  description: 'Pro-grade Image Processing Suite with WASM Canvas technology',
};

const IMAGE_TOOLS = [
  { slug: 'converter', name: 'Image Converter', desc: 'Convert between PNG, JPG, WebP, AVIF, TIFF' },
  { slug: 'compressor', name: 'Image Compressor', desc: 'Lossless & Lossy compression tuning' },
  { slug: 'cropper', name: 'Smart Cropper', desc: 'Aspect ratio and freehand intelligent cropping' },
  { slug: 'resizer', name: 'Batch Resizer', desc: 'Resize images to specific dimensions or percentages' },
  { slug: 'watermark', name: 'Watermark Engine', desc: 'Batch apply text or logo watermarks' },
  { slug: 'background-remover', name: 'AI Background Remover', desc: 'Remove backgrounds via local ONNX model' },
  { slug: 'upscaler', name: 'AI Image Upscaler', desc: 'Enhance resolution using ESRGAN models locally' },
  { slug: 'filters', name: 'Pro Filters', desc: 'Color grading, LUTs, and Instagram-style filters' },
  { slug: 'metadata', name: 'EXIF Editor', desc: 'Read, modify, or strip GPS and camera metadata' },
  { slug: 'color-picker', name: 'Color Extractor', desc: 'Extract dominant color palettes and hex codes' },
  { slug: 'blur', name: 'Privacy Blur', desc: 'Auto-detect faces/plates and apply Gaussian blur' },
  { slug: 'sharpen', name: 'Detail Sharpener', desc: 'Unsharp masking and clarity enhancements' },
  { slug: 'noise-reduction', name: 'Denoise Engine', desc: 'Remove grain and ISO noise from low-light photos' },
  { slug: 'black-and-white', name: 'B&W Converter', desc: 'Professional black & white contrast conversion' },
  { slug: 'collage', name: 'Collage Maker', desc: 'Grid assembler for multiple photos' },
  { slug: 'spritesheet', name: 'Sprite Generator', desc: 'Combine sequence images into a CSS spritesheet' },
  { slug: 'gif-maker', name: 'GIF Creator', desc: 'Create animated GIFs from image sequences' },
  { slug: 'ico-converter', name: 'Favicon Generator', desc: 'Generate multi-resolution .ico files' },
  { slug: 'b64-encoder', name: 'Base64 Encoder', desc: 'Convert small images directly to Data URIs' },
  { slug: 'svg-optimizer', name: 'SVG Optimizer', desc: 'Minify and clean vector SVG files' },
  { slug: 'pdf-to-image', name: 'PDF to Image', desc: 'Extract pages from PDFs into high-res images' },
  { slug: 'image-to-pdf', name: 'Image to PDF', desc: 'Combine multiple images into a single PDF document' },
  { slug: 'color-replace', name: 'Color Replacer', desc: 'Selectively replace specific colors with tolerance' },
  { slug: 'meme-generator', name: 'Meme Typography', desc: 'Add Impact font and stroke styles to photos' },
  { slug: 'split', name: 'Grid Splitter', desc: 'Slice an image into a 3x3 or custom grid for Instagram' },
  { slug: 'rotate-flip', name: 'Rotate & Flip', desc: 'Lossless EXIF orientation correction' },
  { slug: 'hdr', name: 'Fake HDR', desc: 'Lift shadows and compress highlights dynamically' },
  { slug: 'glitch', name: 'Glitch Art', desc: 'Apply RGB shift and databending effects' },
  { slug: 'pixelate', name: 'Pixel Art Converter', desc: 'Downscale and quantize color palettes' },
  { slug: 'batch-rename', name: 'Batch Renamer', desc: 'Template-based strict file renaming for photo shoots' },
];

export default function ImageHubPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
          Image Matrix
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          30 Professional-Grade Image Processing Tools powered by WebAssembly Canvas directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {IMAGE_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/image/${tool.slug}`}
            className="group block p-6 bg-card border border-border/50 rounded-2xl hover:border-pink-500/50 hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)] transition-all duration-300"
          >
            <h3 className="font-semibold text-lg group-hover:text-pink-500 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {tool.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
