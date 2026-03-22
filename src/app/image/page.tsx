'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const IMAGE_TOOLS = [
  { id: 'converter', name: 'Image Converter', desc: 'Convert between PNG, JPG, WEBP, GIF, SVG', icon: '🔄' },
  { id: 'resizer', name: 'Image Resizer', desc: 'Resize images with high quality (Lanczos)', icon: '📐' },
  { id: 'compressor', name: 'Image Compressor', desc: 'Compress images intelligently', icon: '🗜️' },
  { id: 'cropper', name: 'Image Cropper', desc: 'Crop with free or locked aspects', icon: '✂️' },
  { id: 'rotator', name: 'Rotator & Flipper', desc: 'Rotate or flip images', icon: '🔁' },
  { id: 'filter-studio', name: 'Filter Studio', desc: 'Apply real-time Instagram-like filters', icon: '✨' },
  { id: 'brightness-contrast', name: 'Brightness & Contrast', desc: 'Adjust luminance and contrast', icon: '☀️' },
  { id: 'color-adjustment', name: 'Color Adjustment', desc: 'HSL, vibrance, and temperature editor', icon: '🎨' },
  { id: 'ai-upscaler', name: 'AI Upscaler', desc: 'Upscale 2x/4x via WebGPU/TensorFlow', icon: '📈' },
  { id: 'background-remover', name: 'Background Remover', desc: '1-click AI background removal', icon: '🪄' },
  { id: 'heic-converter', name: 'HEIC Converter', desc: 'Convert Apple HEIC photos instantly', icon: '🍏' },
  { id: 'watermark', name: 'Watermark Engine', desc: 'Add text or logo watermarks batch', icon: '©️' },
  { id: 'text-editor', name: 'Text on Image', desc: 'Rich text overlay with custom fonts', icon: '📝' },
  { id: 'collage', name: 'Collage Maker', desc: 'Combine multiple photos', icon: '🖼️' },
  { id: 'sharpener', name: 'Image Sharpener', desc: 'Unsharp mask & detail enhancer', icon: '🔪' },
  { id: 'blur', name: 'Blur Tool', desc: 'Gaussian and motion blur effects', icon: '🌫️' },
  { id: 'denoise', name: 'Noise Reducer', desc: 'Remove grain from photos via AI', icon: '🧹' },
  { id: 'metadata', name: 'Metadata Editor', desc: 'View or edit EXIF data', icon: 'ℹ️' },
  { id: 'histogram', name: 'Histogram Viewer', desc: 'Analyze RGB color distribution', icon: '📊' },
  { id: 'color-picker', name: 'Color Picker', desc: 'Extract colors precisely', icon: '📌' },
  { id: 'svg-converter', name: 'SVG to PNG/JPG', desc: 'Rasterize vector graphics', icon: '📏' },
  { id: 'raw-converter', name: 'RAW Converter', desc: 'Process CR2, NEF, ARW files', icon: '📷' },
  { id: 'qr-generator', name: 'QR Generator', desc: 'Create custom QR codes', icon: '📱' },
  { id: 'batch-resizer', name: 'Batch Resizer', desc: 'Resize multiple images into ZIP', icon: '📦' },
  { id: 'face-blur', name: 'Face Blur AI', desc: 'Automatically detect & blur faces', icon: '👤' },
  { id: 'base64', name: 'Base64 Encoder', desc: 'Convert images to/from Base64', icon: '🔤' },
  { id: 'photo-enhancer', name: 'Auto Enhancer', desc: 'One-click AI photo enhancement', icon: '🌟' },
  { id: 'palette', name: 'Palette Extractor', desc: 'Extract color schemes via k-means', icon: '🎭' },
  { id: 'screenshot-to-code', name: 'Screenshot to Code', desc: 'Turn UI images into HTML/Tailwind', icon: '💻' },
  { id: 'sprite', name: 'Sprite Generator', desc: 'Pack images into a CSS sprite sheet', icon: '👾' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function ImageToolsPage() {
  return (
    <div className="p-6 md:p-12 max-w-[1600px] mx-auto space-y-12">
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Image Studio
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Professional grade, client-side powered image processing. Featuring WebGPU AI models, Canvas 2D filters, and batch processing — without sending your data to any server.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2"
      >
        {IMAGE_TOOLS.map((tool) => (
          <motion.div key={tool.id} variants={itemVariants}>
            <Link
              href={`/image/${tool.id}`}
              className="group relative flex flex-col gap-3 p-6 rounded-3xl border bg-card/60 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-4xl filter drop-shadow-sm group-hover:scale-125 transition-transform duration-500 origin-bottom-left group-hover:-rotate-6">
                {tool.icon}
              </div>
              <div className="space-y-1 z-10">
                <h3 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-indigo-500 group-hover:to-purple-500 transition-all">{tool.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
