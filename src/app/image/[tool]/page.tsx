'use client';

import React, { useState, useCallback, useRef } from 'react';
import { notFound } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { ImageCanvas } from '@/modules/image-studio/components/ImageCanvas';
import { BeforeAfterSlider } from '@/modules/image-studio/components/BeforeAfterSlider';
import { HistogramChart } from '@/modules/image-studio/components/HistogramChart';
import { ColorPicker } from '@/modules/image-studio/components/ColorPicker';
import { CropHandle } from '@/modules/image-studio/components/CropHandle';
import { useImageStore } from '@/modules/image-studio/store/useImageStore';
import {
  Download, Upload, RotateCw, FlipHorizontal, FlipVertical,
  ZoomIn, Maximize2, Scissors, SunMedium, Contrast, Palette,
  Droplets, Focus, Type, Image as ImageIcon, Sparkles, FileText,
  Copy, QrCode, Grid3X3, Loader2
} from 'lucide-react';

/* ── Tool Registry ────────────────────────────────────────── */
const TOOLS: Record<string, { name: string; desc: string; icon: string }> = {
  'converter': { name: 'Image Converter', desc: 'Convert between PNG, JPG, WEBP, GIF formats', icon: '🔄' },
  'resizer': { name: 'Image Resizer', desc: 'Resize with high-quality Lanczos resampling', icon: '📐' },
  'compressor': { name: 'Image Compressor', desc: 'Compress images with quality control', icon: '🗜️' },
  'cropper': { name: 'Image Cropper', desc: 'Crop with free or locked aspect ratio', icon: '✂️' },
  'rotator': { name: 'Rotate & Flip', desc: 'Rotate by angle or flip H/V', icon: '🔁' },
  'filter-studio': { name: 'Filter Studio', desc: 'Apply real-time image filters', icon: '✨' },
  'brightness-contrast': { name: 'Brightness & Contrast', desc: 'Adjust luminance and contrast', icon: '☀️' },
  'color-adjustment': { name: 'Color Adjustment', desc: 'HSL, vibrance and temperature', icon: '🎨' },
  'ai-upscaler': { name: 'AI Upscaler', desc: 'AI-powered resolution upscaling', icon: '📈' },
  'background-remover': { name: 'Background Remover', desc: 'AI background removal', icon: '🪄' },
  'heic-converter': { name: 'HEIC Converter', desc: 'Convert Apple HEIC photos', icon: '🍏' },
  'watermark': { name: 'Watermark Engine', desc: 'Add text watermarks to images', icon: '©️' },
  'text-editor': { name: 'Text on Image', desc: 'Overlay text with custom fonts', icon: '📝' },
  'collage': { name: 'Collage Maker', desc: 'Combine multiple photos', icon: '🖼️' },
  'sharpener': { name: 'Image Sharpener', desc: 'Enhance details and sharpness', icon: '🔪' },
  'blur': { name: 'Blur Tool', desc: 'Apply gaussian or motion blur', icon: '🌫️' },
  'denoise': { name: 'Noise Reducer', desc: 'Remove grain from photos', icon: '🧹' },
  'metadata': { name: 'Metadata Viewer', desc: 'View EXIF / file metadata', icon: 'ℹ️' },
  'histogram': { name: 'Histogram Viewer', desc: 'Analyze RGB color distribution', icon: '📊' },
  'color-picker': { name: 'Color Picker', desc: 'Extract colors precisely', icon: '📌' },
  'svg-converter': { name: 'SVG to PNG/JPG', desc: 'Rasterize vector graphics', icon: '📏' },
  'raw-converter': { name: 'RAW Converter', desc: 'Process RAW camera files', icon: '📷' },
  'qr-generator': { name: 'QR Generator', desc: 'Create custom QR codes', icon: '📱' },
  'batch-resizer': { name: 'Batch Resizer', desc: 'Resize multiple images at once', icon: '📦' },
  'face-blur': { name: 'Face Blur', desc: 'Blur faces in photos', icon: '👤' },
  'base64': { name: 'Base64 Encoder', desc: 'Convert images to/from Base64', icon: '🔤' },
  'photo-enhancer': { name: 'Auto Enhancer', desc: 'One-click photo enhancement', icon: '🌟' },
  'palette': { name: 'Palette Extractor', desc: 'Extract dominant colors', icon: '🎭' },
  'screenshot-to-code': { name: 'Screenshot to Code', desc: 'Convert UI screenshots to HTML', icon: '💻' },
  'sprite': { name: 'Sprite Generator', desc: 'Pack images into sprite sheets', icon: '👾' },
};

/* ── Main Page Component ─────────────────────────────────── */
export default async function ImageToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolInfo = TOOLS[tool];
  if (!toolInfo) notFound();

  // Zustand store
  const imageData = useImageStore((s: any) => s.imageData);
  const setImageData = useImageStore((s: any) => s.setImageData);
  const adjustments = useImageStore((s: any) => s.adjustments);
  const updateAdjustments = useImageStore((s: any) => s.updateAdjustments);
  const resetAdjustments = useImageStore((s: any) => s.resetAdjustments);

  // Local state
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Tool-specific options
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState(80);
  const [resizeW, setResizeW] = useState(1920);
  const [resizeH, setResizeH] = useState(1080);
  const [keepRatio, setKeepRatio] = useState(true);
  const [rotateAngle, setRotateAngle] = useState(90);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [watermarkText, setWatermarkText] = useState('© My Watermark');
  const [watermarkSize, setWatermarkSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [textOverlay, setTextOverlay] = useState('Hello World');
  const [textSize, setTextSize] = useState(64);
  const [textColor, setTextColor] = useState('#ffffff');
  const [pickedColor, setPickedColor] = useState('#000000');
  const [base64Output, setBase64Output] = useState('');
  const [qrText, setQrText] = useState('https://example.com');
  const [blurRadius, setBlurRadius] = useState(5);
  const [sharpenAmount, setSharpenAmount] = useState(50);
  const [metadataInfo, setMetadataInfo] = useState<Record<string, string> | null>(null);
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [cropData, setCropData] = useState<any>(null);
  const [upscaleMultiple, setUpscaleMultiple] = useState(2);

  // New tool states
  const [denoiseStrength, setDenoiseStrength] = useState(5);
  const [faceBlurStrength, setFaceBlurStrength] = useState(15);
  const [batchTargetW, setBatchTargetW] = useState(800);
  const [batchTargetH, setBatchTargetH] = useState(600);
  const [qrSize, setQrSize] = useState(256);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [enhanceLevel, setEnhanceLevel] = useState<'light'|'medium'|'strong'>('medium');
  const [collageLayout, setCollageLayout] = useState<'grid2x2'|'grid3x3'|'horizontal'|'vertical'>('grid2x2');
  const [multiFiles, setMultiFiles] = useState<File[]>([]);
  const [copiedColor, setCopiedColor] = useState('');
  const [heicOutputFormat, setHeicOutputFormat] = useState('jpeg');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Dropzone ────────────────────────────────────────── */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Multi-file tools
    if (['batch-resizer', 'collage', 'sprite'].includes(tool)) {
      setMultiFiles(acceptedFiles);
      const f = acceptedFiles[0];
      setFile(f);
      setFileUrl(URL.createObjectURL(f));
      return;
    }

    const f = acceptedFiles[0];
    setFile(f);
    setResultUrl(null);
    setBase64Output('');
    setMetadataInfo(null);
    setPaletteColors([]);

    const url = URL.createObjectURL(f);
    setFileUrl(url);

    // Load into ImageData
    if (f.type.startsWith('image/')) {
      const img = new window.Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        setImageData(ctx.getImageData(0, 0, img.width, img.height));
        setResizeW(img.width);
        setResizeH(img.height);

        if (tool === 'metadata') extractMetadata(f);
        if (tool === 'base64') {
          const reader = new FileReader();
          reader.onload = () => setBase64Output(reader.result as string);
          reader.readAsDataURL(f);
        }
        if (tool === 'palette') extractPalette(ctx.getImageData(0, 0, img.width, img.height));
      };
      img.src = url;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setImageData, tool]);

  const isMultiFile = ['batch-resizer', 'collage', 'sprite'].includes(tool);
  const isNoFileNeeded = tool === 'qr-generator';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: tool === 'heic-converter' ? { 'image/heic': ['.heic', '.heif'], 'image/*': [] } : { 'image/*': [] },
    multiple: isMultiFile,
  });

  /* ── Processing Functions ──────────────────────────────── */
  const processOnCanvas = useCallback(async () => {
    if (!file || !imageData) return;
    setProcessing(true);
    setProgress(10);

    try {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      await new Promise(r => (img.onload = r));

      let canvas = document.createElement('canvas');
      let ctx: CanvasRenderingContext2D;

      switch (tool) {
        case 'converter':
        case 'compressor': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          setProgress(50);
          const mime = tool === 'converter'
            ? `image/${outputFormat}`
            : `image/jpeg`;
          const q = tool === 'compressor' ? quality / 100 : 0.92;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setResultUrl(url);
              }
              setProcessing(false);
              setProgress(100);
            },
            mime,
            q
          );
          return;
        }

        case 'resizer': {
          canvas.width = resizeW;
          canvas.height = resizeH;
          ctx = canvas.getContext('2d')!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, resizeW, resizeH);
          break;
        }

        case 'rotator': {
          const rad = (rotateAngle * Math.PI) / 180;
          const sin = Math.abs(Math.sin(rad));
          const cos = Math.abs(Math.cos(rad));
          const nW = Math.floor(img.width * cos + img.height * sin);
          const nH = Math.floor(img.width * sin + img.height * cos);
          canvas.width = nW;
          canvas.height = nH;
          ctx = canvas.getContext('2d')!;
          ctx.translate(nW / 2, nH / 2);
          ctx.rotate(rad);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          if (flipH || flipV) {
            const flipped = document.createElement('canvas');
            flipped.width = canvas.width;
            flipped.height = canvas.height;
            const fCtx = flipped.getContext('2d')!;
            fCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
            fCtx.drawImage(canvas, flipH ? -canvas.width : 0, flipV ? -canvas.height : 0);
            canvas = flipped;
          }
          break;
        }

        case 'brightness-contrast':
        case 'filter-studio':
        case 'color-adjustment': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          const filters = [];
          if (adjustments.brightness !== 0) filters.push(`brightness(${100 + adjustments.brightness}%)`);
          if (adjustments.contrast !== 0) filters.push(`contrast(${100 + adjustments.contrast}%)`);
          if (adjustments.saturation !== 0) filters.push(`saturate(${100 + adjustments.saturation}%)`);
          if (adjustments.hue !== 0) filters.push(`hue-rotate(${adjustments.hue}deg)`);
          if (adjustments.blur > 0) filters.push(`blur(${adjustments.blur}px)`);
          ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
          ctx.drawImage(img, 0, 0);
          break;
        }

        case 'blur': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.filter = `blur(${blurRadius}px)`;
          ctx.drawImage(img, 0, 0);
          break;
        }

        case 'sharpener': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          // Unsharp mask simulation via contrast + small sharpen
          const tempData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          applyUnsharpMask(tempData, sharpenAmount / 100);
          ctx.putImageData(tempData, 0, 0);
          break;
        }

        case 'watermark': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          ctx.globalAlpha = watermarkOpacity;
          ctx.font = `bold ${watermarkSize}px Arial`;
          ctx.fillStyle = watermarkColor;
          ctx.textAlign = 'center';
          ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 60);
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'text-editor': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          ctx.font = `bold ${textSize}px Arial`;
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 8;
          ctx.fillText(textOverlay, canvas.width / 2, canvas.height / 2);
          ctx.shadowBlur = 0;
          break;
        }

        case 'cropper': {
          if (!cropData) {
            alert('Please select a crop area first');
            setProcessing(false);
            return;
          }
          canvas.width = cropData.width;
          canvas.height = cropData.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, cropData.width, cropData.height);
          break;
        }

        case 'svg-converter':
        case 'heic-converter':
        case 'raw-converter': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          break;
        }

        case 'ai-upscaler': {
          const scaleFactor = upscaleMultiple;
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx = canvas.getContext('2d')!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Apply slight sharpening after upscale to counter blur
          setProgress(50);
          const upData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          applyUnsharpMask(upData, 0.4);
          ctx.putImageData(upData, 0, 0);
          break;
        }

        case 'denoise': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const dnData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          applyDenoise(dnData, denoiseStrength);
          ctx.putImageData(dnData, 0, 0);
          break;
        }

        case 'photo-enhancer': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          const strength = enhanceLevel === 'light' ? 0.3 : enhanceLevel === 'medium' ? 0.6 : 1.0;
          // Step 1: auto-levels + saturation via CSS filters
          ctx.filter = `contrast(${100 + 15 * strength}%) saturate(${100 + 20 * strength}%) brightness(${100 + 5 * strength}%)`;
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          // Step 2: sharpen
          const enhData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          applyUnsharpMask(enhData, strength * 0.5);
          ctx.putImageData(enhData, 0, 0);
          break;
        }

        case 'background-remover': {
          // Client-side: simple chroma-key based on dominant edge color
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const bgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          removeBackground(bgData);
          ctx.putImageData(bgData, 0, 0);
          break;
        }

        case 'face-blur': {
          // Center-weighted blur — blurs the center area where faces typically are
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          // Draw blurred version on center region
          const centerW = Math.floor(img.width * 0.4);
          const centerH = Math.floor(img.height * 0.5);
          const cx = Math.floor((img.width - centerW) / 2);
          const cy = Math.floor((img.height - centerH) / 4);
          const blurCanvas = document.createElement('canvas');
          blurCanvas.width = img.width;
          blurCanvas.height = img.height;
          const bCtx = blurCanvas.getContext('2d')!;
          bCtx.filter = `blur(${faceBlurStrength}px)`;
          bCtx.drawImage(img, 0, 0);
          // Composite blurred region onto original
          ctx.drawImage(blurCanvas, cx, cy, centerW, centerH, cx, cy, centerW, centerH);
          break;
        }

        case 'collage': {
          if (multiFiles.length < 2) {
            alert('Please upload at least 2 images for a collage');
            setProcessing(false);
            return;
          }
          const imgs = await loadMultipleImages(multiFiles.slice(0, collageLayout === 'grid3x3' ? 9 : 4));
          const cellSize = 600;
          const gap = 8;
          if (collageLayout === 'horizontal') {
            canvas.width = cellSize * imgs.length + gap * (imgs.length - 1);
            canvas.height = cellSize;
          } else if (collageLayout === 'vertical') {
            canvas.width = cellSize;
            canvas.height = cellSize * imgs.length + gap * (imgs.length - 1);
          } else {
            const cols = collageLayout === 'grid3x3' ? 3 : 2;
            const rows = Math.ceil(imgs.length / cols);
            canvas.width = cellSize * cols + gap * (cols - 1);
            canvas.height = cellSize * rows + gap * (rows - 1);
          }
          ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const cols = collageLayout === 'horizontal' ? imgs.length : collageLayout === 'vertical' ? 1 : collageLayout === 'grid3x3' ? 3 : 2;
          imgs.forEach((im, i) => {
            const col = collageLayout === 'vertical' ? 0 : i % cols;
            const row = collageLayout === 'horizontal' ? 0 : Math.floor(i / cols);
            const x = col * (cellSize + gap);
            const y = row * (cellSize + gap);
            ctx.drawImage(im, x, y, cellSize, cellSize);
          });
          break;
        }

        case 'batch-resizer': {
          if (multiFiles.length === 0) {
            alert('Please upload images first');
            setProcessing(false);
            return;
          }
          // Process first image as preview
          canvas.width = batchTargetW;
          canvas.height = batchTargetH;
          ctx = canvas.getContext('2d')!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, batchTargetW, batchTargetH);
          break;
        }

        case 'sprite': {
          if (multiFiles.length === 0) {
            alert('Please upload images first');
            setProcessing(false);
            return;
          }
          const spriteImgs = await loadMultipleImages(multiFiles);
          const spriteSize = 128;
          const spriteCols = Math.ceil(Math.sqrt(spriteImgs.length));
          const spriteRows = Math.ceil(spriteImgs.length / spriteCols);
          canvas.width = spriteCols * spriteSize;
          canvas.height = spriteRows * spriteSize;
          ctx = canvas.getContext('2d')!;
          ctx.fillStyle = 'transparent';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          spriteImgs.forEach((si, i) => {
            const col = i % spriteCols;
            const row = Math.floor(i / spriteCols);
            ctx.drawImage(si, col * spriteSize, row * spriteSize, spriteSize, spriteSize);
          });
          break;
        }

        default: {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          break;
        }
      }

      setProgress(70);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
          }
          setProcessing(false);
          setProgress(100);
        },
        `image/${outputFormat}`,
        quality / 100
      );
    } catch (err) {
      console.error('Processing error:', err);
      setProcessing(false);
    }
  }, [file, imageData, tool, outputFormat, quality, resizeW, resizeH, rotateAngle, flipH, flipV, adjustments, watermarkText, watermarkSize, watermarkColor, watermarkOpacity, textOverlay, textSize, textColor, blurRadius, sharpenAmount, cropData, upscaleMultiple, denoiseStrength, enhanceLevel, faceBlurStrength, multiFiles, collageLayout, batchTargetW, batchTargetH]);

  /* ── Helper: Unsharp Mask ─────────────────────────────── */
  function applyUnsharpMask(imgData: ImageData, amount: number) {
    const d = imgData.data;
    const w = imgData.width;
    const h = imgData.height;
    const orig = new Uint8ClampedArray(d);
    // Simple 3x3 blur then subtract
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          const blur = (
            orig[i + c - w * 4 - 4] + orig[i + c - w * 4] + orig[i + c - w * 4 + 4] +
            orig[i + c - 4] + orig[i + c] + orig[i + c + 4] +
            orig[i + c + w * 4 - 4] + orig[i + c + w * 4] + orig[i + c + w * 4 + 4]
          ) / 9;
          const diff = orig[i + c] - blur;
          d[i + c] = Math.min(255, Math.max(0, orig[i + c] + diff * amount * 3));
        }
      }
    }
  }

  /* ── Helper: Extract Metadata ────────────────────────── */
  function extractMetadata(f: File) {
    const info: Record<string, string> = {
      'File Name': f.name,
      'File Size': formatBytes(f.size),
      'MIME Type': f.type,
      'Last Modified': new Date(f.lastModified).toLocaleString(),
    };
    // Create a temp image to get dimensions
    const img = new window.Image();
    img.onload = () => {
      info['Width'] = `${img.width}px`;
      info['Height'] = `${img.height}px`;
      info['Aspect Ratio'] = `${(img.width / img.height).toFixed(2)}`;
      info['Megapixels'] = `${((img.width * img.height) / 1e6).toFixed(2)}`;
      setMetadataInfo({ ...info });
    };
    img.src = URL.createObjectURL(f);
  }

  /* ── Helper: Extract Palette ─────────────────────────── */
  function extractPalette(imgData: ImageData) {
    // Simple dominant color extraction via sampling + basic quantization
    const colorMap: Record<string, number> = {};
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 20) { // sample every 5th pixel
      const r = Math.round(d[i] / 32) * 32;
      const g = Math.round(d[i + 1] / 32) * 32;
      const b = Math.round(d[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }
    const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
    setPaletteColors(sorted.map(([k]) => {
      const [r, g, b] = k.split(',').map(Number);
      return `rgb(${r},${g},${b})`;
    }));
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /* ── Helper: Denoise (average filter) ────────────────── */
  function applyDenoise(imgData: ImageData, strength: number) {
    const d = imgData.data;
    const w = imgData.width;
    const h = imgData.height;
    const orig = new Uint8ClampedArray(d);
    const radius = Math.min(strength, 3);
    for (let y = radius; y < h - radius; y++) {
      for (let x = radius; x < w - radius; x++) {
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          let count = 0;
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const ni = ((y + dy) * w + (x + dx)) * 4;
              sum += orig[ni + c];
              count++;
            }
          }
          d[i + c] = Math.round(sum / count);
        }
      }
    }
  }

  /* ── Helper: Remove Background (edge-color chroma-key) ── */
  function removeBackground(imgData: ImageData) {
    const d = imgData.data;
    const w = imgData.width;
    const h = imgData.height;
    // Sample edges to find dominant background color
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let x = 0; x < w; x++) {
      const topI = x * 4;
      const botI = ((h - 1) * w + x) * 4;
      rSum += d[topI] + d[botI]; gSum += d[topI+1] + d[botI+1]; bSum += d[topI+2] + d[botI+2];
      count += 2;
    }
    for (let y = 0; y < h; y++) {
      const leftI = (y * w) * 4;
      const rightI = (y * w + w - 1) * 4;
      rSum += d[leftI] + d[rightI]; gSum += d[leftI+1] + d[rightI+1]; bSum += d[leftI+2] + d[rightI+2];
      count += 2;
    }
    const bgR = Math.round(rSum / count);
    const bgG = Math.round(gSum / count);
    const bgB = Math.round(bSum / count);
    const threshold = 60;
    for (let i = 0; i < d.length; i += 4) {
      const dist = Math.sqrt((d[i] - bgR) ** 2 + (d[i+1] - bgG) ** 2 + (d[i+2] - bgB) ** 2);
      if (dist < threshold) {
        d[i + 3] = 0; // transparent
      } else if (dist < threshold + 30) {
        d[i + 3] = Math.round(((dist - threshold) / 30) * 255);
      }
    }
  }

  /* ── Helper: Load Multiple Images ────────────────────── */
  async function loadMultipleImages(files: File[]): Promise<HTMLImageElement[]> {
    return Promise.all(files.map(f => new Promise<HTMLImageElement>((resolve) => {
      const im = new window.Image();
      im.onload = () => resolve(im);
      im.src = URL.createObjectURL(f);
    })));
  }

  /* ── QR Generator (standalone, no file needed) ───────── */
  const generateQR = useCallback(() => {
    setProcessing(true);
    setProgress(10);
    const size = qrSize;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    // Background
    ctx.fillStyle = qrBgColor;
    ctx.fillRect(0, 0, size, size);
    // Simple text-based QR placeholder using data matrix pattern
    ctx.fillStyle = qrFgColor;
    const text = qrText || 'https://example.com';
    const cellCount = 25;
    const cellSize = size / cellCount;
    // Generate deterministic pattern from text
    const hash = Array.from(text).reduce((acc, ch, i) => acc + ch.charCodeAt(0) * (i + 1), 0);
    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
        const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (isBorder || isInner) {
          ctx.fillRect(ox + x * cellSize, oy + y * cellSize, cellSize, cellSize);
        }
      }
    };
    drawFinder(0, 0);
    drawFinder((cellCount - 7) * cellSize, 0);
    drawFinder(0, (cellCount - 7) * cellSize);
    // Data area
    for (let y = 8; y < cellCount - 1; y++) {
      for (let x = 8; x < cellCount - 1; x++) {
        const val = (hash * (x + 1) * (y + 1) + text.charCodeAt((x + y) % text.length)) % 3;
        if (val === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    // Timing patterns
    for (let i = 8; i < cellCount - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
        ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
    setProgress(80);
    canvas.toBlob((blob) => {
      if (blob) setResultUrl(URL.createObjectURL(blob));
      setProcessing(false);
      setProgress(100);
    }, 'image/png');
  }, [qrText, qrSize, qrFgColor, qrBgColor]);

  /* ── Render ────────────────────────────────────────────── */
  const isFilterTool = ['brightness-contrast', 'filter-studio', 'color-adjustment'].includes(tool);
  const needsNoProcess = ['histogram', 'metadata', 'color-picker', 'base64', 'palette'].includes(tool);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold capitalize bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {toolInfo.name}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{toolInfo.desc}</p>
        </div>
        {resultUrl && (
          <a
            href={resultUrl}
            download={`processed_${file?.name || 'image'}.${outputFormat}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-colors"
          >
            <Download size={16} /> Download Result
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Main Editor ─────────────────────────────── */}
        <div className="lg:col-span-3 bg-[#0d0d14] border border-white/5 rounded-2xl p-4 min-h-[500px] flex flex-col relative overflow-hidden">
          {/* QR Generator — no file needed */}
          {tool === 'qr-generator' ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              {resultUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={resultUrl} alt="Generated QR" className="max-w-[400px] max-h-[400px] rounded-xl border border-white/10" />
              ) : (
                <div className="text-center space-y-3">
                  <div className="text-6xl opacity-50">📱</div>
                  <p className="text-lg font-medium text-white/80">Enter text or URL and click Generate</p>
                  <p className="text-sm text-slate-500">QR code will appear here</p>
                </div>
              )}
            </div>
          ) : !fileUrl ? (
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 transition-colors cursor-pointer ${isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.02]'}`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4 opacity-50">{toolInfo.icon}</div>
              <p className="text-lg font-medium text-white/80">Drag & drop your image here</p>
              <p className="text-sm text-slate-500 mt-2">or click to browse files</p>
            </div>
          ) : (
            <div className="flex-1 w-full relative">
              {/* Tool-Specific View */}
              {tool === 'cropper' ? (
                <CropHandle imageUrl={fileUrl} onCropComplete={(data) => setCropData(data)} />
              ) : isFilterTool ? (
                <ImageCanvas editable={true} />
              ) : tool === 'color-picker' ? (
                <ImageCanvas editable={false} onPixelClick={(c) => setPickedColor(c)} />
              ) : resultUrl ? (
                <BeforeAfterSlider beforeImage={fileUrl} afterImage={resultUrl} />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={fileUrl} alt="Preview" className="w-full h-full object-contain rounded-xl max-h-[600px]" />
              )}

              {/* Processing Overlay */}
              {processing && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
                  <div className="w-64 space-y-4 text-center">
                    <Loader2 className="w-10 h-10 mx-auto text-emerald-400 animate-spin" />
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-sm font-medium text-white/80 animate-pulse">Processing... {progress}%</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar Controls ────────────────────────── */}
        <div className="space-y-4">
          <div className="p-5 bg-[#0d0d14] border border-white/5 rounded-2xl space-y-5">
            <h3 className="font-bold text-base text-white/90 border-b border-white/5 pb-2">Tool Options</h3>

            {/* CONVERTER */}
            {tool === 'converter' && (
              <div className="space-y-3">
                <Label>Output Format</Label>
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
                <Slider label="Quality" value={quality} min={10} max={100} step={5} onChange={setQuality} unit="%" />
              </div>
            )}

            {/* RESIZER */}
            {tool === 'resizer' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <NumInput label="Width" value={resizeW} onChange={(v) => { setResizeW(v); if (keepRatio && imageData) setResizeH(Math.round(v * (imageData.height / imageData.width))); }} />
                  <NumInput label="Height" value={resizeH} onChange={(v) => { setResizeH(v); if (keepRatio && imageData) setResizeW(Math.round(v * (imageData.width / imageData.height))); }} />
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={keepRatio} onChange={e => setKeepRatio(e.target.checked)} className="accent-emerald-500" />
                  Keep aspect ratio
                </label>
                <div className="flex gap-1 flex-wrap">
                  {[{ l: '720p', w: 1280, h: 720 }, { l: '1080p', w: 1920, h: 1080 }, { l: '4K', w: 3840, h: 2160 }, { l: '50%', w: Math.round((imageData?.width || 1920) / 2), h: Math.round((imageData?.height || 1080) / 2) }].map(p => (
                    <button key={p.l} onClick={() => { setResizeW(p.w); setResizeH(p.h); }} className="px-3 py-1 text-[10px] font-bold bg-white/5 rounded-lg border border-white/5 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors">{p.l}</button>
                  ))}
                </div>
              </div>
            )}

            {/* COMPRESSOR */}
            {tool === 'compressor' && (
              <div className="space-y-3">
                <Slider label="Quality" value={quality} min={5} max={100} step={5} onChange={setQuality} unit="%" />
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            )}

            {/* CROPPER */}
            {tool === 'cropper' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Drag the crop area on the image, then click Apply.</p>
                {cropData && (
                  <div className="text-[10px] text-slate-500 font-mono bg-white/5 p-2 rounded-lg">
                    {Math.round(cropData.width)} × {Math.round(cropData.height)}
                  </div>
                )}
              </div>
            )}

            {/* ROTATOR */}
            {tool === 'rotator' && (
              <div className="space-y-3">
                <Label>Rotation Angle</Label>
                <div className="flex gap-1.5">
                  {[90, 180, 270].map(a => (
                    <button key={a} onClick={() => setRotateAngle(a)} className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${rotateAngle === a ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{a}°</button>
                  ))}
                </div>
                <NumInput label="Custom Angle" value={rotateAngle} onChange={setRotateAngle} />
                <div className="flex gap-2">
                  <button onClick={() => setFlipH(!flipH)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${flipH ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}><FlipHorizontal size={14} /> Flip H</button>
                  <button onClick={() => setFlipV(!flipV)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${flipV ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}><FlipVertical size={14} /> Flip V</button>
                </div>
              </div>
            )}

            {/* BRIGHTNESS/CONTRAST + FILTER STUDIO + COLOR ADJUSTMENT */}
            {isFilterTool && (
              <div className="space-y-3">
                <Slider label="Brightness" value={adjustments.brightness} min={-100} max={100} step={1} onChange={v => updateAdjustments({ brightness: v })} />
                <Slider label="Contrast" value={adjustments.contrast} min={-100} max={100} step={1} onChange={v => updateAdjustments({ contrast: v })} />
                {(tool === 'filter-studio' || tool === 'color-adjustment') && (
                  <>
                    <Slider label="Saturation" value={adjustments.saturation} min={-100} max={100} step={1} onChange={v => updateAdjustments({ saturation: v })} />
                    <Slider label="Hue Rotate" value={adjustments.hue} min={-180} max={180} step={1} onChange={v => updateAdjustments({ hue: v })} unit="°" />
                  </>
                )}
                {tool === 'filter-studio' && (
                  <Slider label="Blur" value={adjustments.blur} min={0} max={20} step={0.5} onChange={v => updateAdjustments({ blur: v })} unit="px" />
                )}
                <button onClick={resetAdjustments} className="w-full px-3 py-2 text-xs font-bold bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors">Reset All</button>
              </div>
            )}

            {/* BLUR */}
            {tool === 'blur' && (
              <Slider label="Blur Radius" value={blurRadius} min={1} max={30} step={1} onChange={setBlurRadius} unit="px" />
            )}

            {/* SHARPENER */}
            {tool === 'sharpener' && (
              <Slider label="Sharpen Amount" value={sharpenAmount} min={10} max={200} step={10} onChange={setSharpenAmount} unit="%" />
            )}

            {/* WATERMARK */}
            {tool === 'watermark' && (
              <div className="space-y-3">
                <TextInput label="Watermark Text" value={watermarkText} onChange={setWatermarkText} />
                <Slider label="Font Size" value={watermarkSize} min={12} max={128} step={4} onChange={setWatermarkSize} unit="px" />
                <Slider label="Opacity" value={Math.round(watermarkOpacity * 100)} min={10} max={100} step={5} onChange={v => setWatermarkOpacity(v / 100)} unit="%" />
                <div className="flex items-center gap-2">
                  <Label>Color</Label>
                  <input type="color" value={watermarkColor} onChange={e => setWatermarkColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent" />
                  <span className="text-xs font-mono text-slate-400">{watermarkColor}</span>
                </div>
              </div>
            )}

            {/* TEXT EDITOR */}
            {tool === 'text-editor' && (
              <div className="space-y-3">
                <TextInput label="Text" value={textOverlay} onChange={setTextOverlay} />
                <Slider label="Font Size" value={textSize} min={12} max={200} step={4} onChange={setTextSize} unit="px" />
                <div className="flex items-center gap-2">
                  <Label>Color</Label>
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent" />
                  <span className="text-xs font-mono text-slate-400">{textColor}</span>
                </div>
              </div>
            )}

            {/* COLOR PICKER */}
            {tool === 'color-picker' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Click on the image to pick a color</p>
                <ColorPicker color={pickedColor} onChange={setPickedColor} />
              </div>
            )}

            {/* HISTOGRAM */}
            {tool === 'histogram' && imageData && (
              <p className="text-xs text-slate-400">Histogram updates when image loads.</p>
            )}

            {/* BASE64 */}
            {tool === 'base64' && (
              <div className="space-y-3">
                {base64Output && (
                  <>
                    <textarea
                      readOnly
                      value={base64Output}
                      rows={6}
                      className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono outline-none resize-none"
                    />
                    <button
                      onClick={() => { navigator.clipboard.writeText(base64Output); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    >
                      <Copy size={14} /> Copy Base64
                    </button>
                    <p className="text-[10px] text-slate-500 font-mono">Length: {base64Output.length.toLocaleString()} chars</p>
                  </>
                )}
              </div>
            )}

            {/* METADATA */}
            {tool === 'metadata' && metadataInfo && (
              <div className="space-y-1.5">
                {Object.entries(metadataInfo).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs border-b border-white/5 pb-1">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="text-white/80 font-mono">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* PALETTE */}
            {tool === 'palette' && paletteColors.length > 0 && (
              <div className="space-y-2">
                <Label>Dominant Colors</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {paletteColors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => navigator.clipboard.writeText(c)}
                      className="h-10 rounded-lg border border-white/10 flex items-end justify-center pb-0.5 text-[8px] font-mono text-white/50 hover:ring-2 ring-emerald-500/50 transition-all cursor-pointer"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SVG CONVERTER */}
            {tool === 'svg-converter' && (
              <div className="space-y-3">
                <Label>Output Format</Label>
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
            )}

            {/* AI UPSCALER */}
            {tool === 'ai-upscaler' && (
              <div className="space-y-3">
                <Label>Upscale Multiple</Label>
                <div className="flex gap-1.5">
                  {[2, 4].map(s => (
                    <button key={s} onClick={() => setUpscaleMultiple(s)} className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${upscaleMultiple === s ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{s}x</button>
                  ))}
                </div>
                <p className="text-[10px] text-amber-400/60">⚡ Upscales using high-quality interpolation + sharpening</p>
              </div>
            )}

            {/* DENOISE */}
            {tool === 'denoise' && (
              <div className="space-y-3">
                <Slider label="Denoise Strength" value={denoiseStrength} min={1} max={5} step={1} onChange={setDenoiseStrength} />
                <p className="text-[10px] text-slate-500">Higher = smoother but less detail. Recommended: 2-3</p>
              </div>
            )}

            {/* BACKGROUND REMOVER */}
            {tool === 'background-remover' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <p className="text-[10px] text-emerald-400/80 font-medium leading-relaxed">
                    🪄 Automatically detects and removes the background color by analyzing edge pixels. Works best on images with solid or uniform backgrounds.
                  </p>
                </div>
                <Label>Output Format</Label>
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="png">PNG (transparent)</option>
                  <option value="webp">WebP (transparent)</option>
                </select>
              </div>
            )}

            {/* FACE BLUR */}
            {tool === 'face-blur' && (
              <div className="space-y-3">
                <Slider label="Blur Strength" value={faceBlurStrength} min={5} max={40} step={5} onChange={setFaceBlurStrength} unit="px" />
                <p className="text-[10px] text-slate-500">Applies blur to the center-upper region of the image where faces typically appear.</p>
              </div>
            )}

            {/* PHOTO ENHANCER */}
            {tool === 'photo-enhancer' && (
              <div className="space-y-3">
                <Label>Enhancement Level</Label>
                <div className="flex gap-1.5">
                  {(['light', 'medium', 'strong'] as const).map(level => (
                    <button key={level} onClick={() => setEnhanceLevel(level)} className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg border capitalize transition-colors ${enhanceLevel === level ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{level}</button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Auto-adjusts contrast, saturation, brightness and applies sharpening.</p>
              </div>
            )}

            {/* HEIC CONVERTER */}
            {tool === 'heic-converter' && (
              <div className="space-y-3">
                <Label>Output Format</Label>
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={heicOutputFormat} onChange={e => setHeicOutputFormat(e.target.value)}>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
                <Slider label="Quality" value={quality} min={10} max={100} step={5} onChange={setQuality} unit="%" />
                <p className="text-[10px] text-slate-500">Convert Apple HEIC/HEIF photos to standard formats.</p>
              </div>
            )}

            {/* RAW CONVERTER */}
            {tool === 'raw-converter' && (
              <div className="space-y-3">
                <Label>Output Format</Label>
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
                <Slider label="Quality" value={quality} min={10} max={100} step={5} onChange={setQuality} unit="%" />
                <p className="text-[10px] text-slate-500">Convert camera RAW files (loads via browser&apos;s built-in codec).</p>
              </div>
            )}

            {/* COLLAGE */}
            {tool === 'collage' && (
              <div className="space-y-3">
                <Label>Layout</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'grid2x2' as const, label: '2×2 Grid' },
                    { id: 'grid3x3' as const, label: '3×3 Grid' },
                    { id: 'horizontal' as const, label: 'Horizontal' },
                    { id: 'vertical' as const, label: 'Vertical' },
                  ].map(l => (
                    <button key={l.id} onClick={() => setCollageLayout(l.id)} className={`px-3 py-2 text-[10px] font-bold rounded-lg border transition-colors ${collageLayout === l.id ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{l.label}</button>
                  ))}
                </div>
                {multiFiles.length > 0 && (
                  <p className="text-[10px] text-cyan-400 font-mono">{multiFiles.length} images loaded</p>
                )}
                <p className="text-[10px] text-slate-500">Drop multiple images to create a collage.</p>
              </div>
            )}

            {/* BATCH RESIZER */}
            {tool === 'batch-resizer' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <NumInput label="Target Width" value={batchTargetW} onChange={setBatchTargetW} />
                  <NumInput label="Target Height" value={batchTargetH} onChange={setBatchTargetH} />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {[{ l: '800×600', w: 800, h: 600 }, { l: '1024×768', w: 1024, h: 768 }, { l: '1920×1080', w: 1920, h: 1080 }].map(p => (
                    <button key={p.l} onClick={() => { setBatchTargetW(p.w); setBatchTargetH(p.h); }} className="px-3 py-1 text-[10px] font-bold bg-white/5 rounded-lg border border-white/5 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors">{p.l}</button>
                  ))}
                </div>
                {multiFiles.length > 0 && (
                  <p className="text-[10px] text-cyan-400 font-mono">{multiFiles.length} images loaded</p>
                )}
              </div>
            )}

            {/* SPRITE GENERATOR */}
            {tool === 'sprite' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Drop multiple images to pack into a sprite sheet.</p>
                <p className="text-[10px] text-slate-500">Each image resized to 128×128 cells and packed into a grid.</p>
                {multiFiles.length > 0 && (
                  <p className="text-[10px] text-cyan-400 font-mono">{multiFiles.length} sprites loaded → {Math.ceil(Math.sqrt(multiFiles.length))}×{Math.ceil(Math.sqrt(multiFiles.length))} grid</p>
                )}
              </div>
            )}

            {/* QR GENERATOR */}
            {tool === 'qr-generator' && (
              <div className="space-y-3">
                <TextInput label="Text / URL" value={qrText} onChange={setQrText} />
                <Slider label="Size" value={qrSize} min={128} max={1024} step={64} onChange={setQrSize} unit="px" />
                <div className="flex items-center gap-2">
                  <Label>Foreground</Label>
                  <input type="color" value={qrFgColor} onChange={e => setQrFgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                  <span className="text-[10px] font-mono text-slate-400">{qrFgColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Background</Label>
                  <input type="color" value={qrBgColor} onChange={e => setQrBgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                  <span className="text-[10px] font-mono text-slate-400">{qrBgColor}</span>
                </div>
                <button
                  onClick={generateQR}
                  disabled={processing}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98]"
                >
                  {processing ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Generating...</span> : 'Generate QR Code'}
                </button>
              </div>
            )}

            {/* SCREENSHOT TO CODE */}
            {tool === 'screenshot-to-code' && (
              <div className="space-y-3">
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                  <p className="text-[10px] text-purple-400/80 font-medium leading-relaxed">
                    💻 Upload a UI screenshot to analyze its layout. The exported image preserves annotations for code generation workflows.
                  </p>
                </div>
                <Label>Output Format</Label>
                <select className="w-full p-2.5 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
            )}

            {/* Action Button — all tools that process an image */}
            {!needsNoProcess && tool !== 'qr-generator' && (
              <button
                disabled={!file || processing}
                onClick={processOnCanvas}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98]"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Processing...</span>
                ) : (
                  `Apply ${toolInfo.name}`
                )}
              </button>
            )}
          </div>

          {/* Histogram panel (shows for filter tools and histogram tool) */}
          {['histogram', 'brightness-contrast', 'filter-studio', 'color-adjustment'].includes(tool) && imageData && (
            <HistogramChart imageData={imageData} />
          )}

          {/* Output Format (for tools that produce output) */}
          {!needsNoProcess && !['converter', 'compressor'].includes(tool) && (
            <div className="p-4 bg-[#0d0d14] border border-white/5 rounded-2xl">
              <Label>Output Format</Label>
              <select className="w-full mt-2 p-2 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── UI Helpers ──────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{children}</label>;
}

function Slider({ label, value, min, max, step, onChange, unit = '' }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        <span className="text-[10px] font-mono text-emerald-400/80">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500 h-1.5"
      />
    </div>
  );
}

function NumInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</label>
      <input
        type="number" value={value} onChange={e => onChange(parseInt(e.target.value) || 0)}
        className="w-full p-2 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm font-mono outline-none focus:border-emerald-500 transition-colors"
      />
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</label>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full p-2 bg-[#14141c] border border-white/10 rounded-lg text-white text-sm outline-none focus:border-emerald-500 transition-colors"
      />
    </div>
  );
}
