// ============================================================
// VIDEO ROUTES — All 30 features registered
// File: src/app/modules/video/video.routes.ts
// ============================================================

import { Routes } from '@angular/router';

export const VIDEO_ROUTES: Routes = [
  {
    path: 'trimmer',
    loadComponent: () => import('./01-trimmer/trimmer.component').then(m => m.TrimmerComponent),
    title: 'Video Trimmer — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'merger',
    loadComponent: () => import('./02-merger/merger.component').then(m => m.MergerComponent),
    title: 'Video Merger — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'converter',
    loadComponent: () => import('./03-converter/converter.component').then(m => m.ConverterComponent),
    title: 'Format Converter — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'compressor',
    loadComponent: () => import('./04-compressor/compressor.component').then(m => m.CompressorComponent),
    title: 'Video Compressor — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'stabilizer',
    loadComponent: () => import('./05-stabilizer/stabilizer.component').then(m => m.StabilizerComponent),
    title: 'Video Stabilizer — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'reverser',
    loadComponent: () => import('./06-reverser/reverser.component').then(m => m.ReverserComponent),
    title: 'Video Reverser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'speed',
    loadComponent: () => import('./07-speed-controller/speedController.component').then(m => m.SpeedControllerComponent),
    title: 'Speed Controller — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'looper',
    loadComponent: () => import('./08-looper/looper.component').then(m => m.LooperComponent),
    title: 'Video Looper — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'flip-rotate',
    loadComponent: () => import('./09-flip-rotate/flipRotate.component').then(m => m.FlipRotateComponent),
    title: 'Flip & Rotate — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'crop-resize',
    loadComponent: () => import('./10-crop-resize/cropResize.component').then(m => m.CropResizeComponent),
    title: 'Smart Crop & Resize — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'color-grading',
    loadComponent: () => import('./11-color-grading/colorGrading.component').then(m => m.ColorGradingComponent),
    title: 'Color Grading — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'subtitles',
    loadComponent: () => import('./12-subtitle-burner/subtitleBurner.component').then(m => m.SubtitleBurnerComponent),
    title: 'Subtitle Burner — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'thumbnail',
    loadComponent: () => import('./13-thumbnail-generator/thumbnailGenerator.component').then(m => m.ThumbnailGeneratorComponent),
    title: 'Thumbnail Generator — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'watermark',
    loadComponent: () => import('./14-watermark/watermark.component').then(m => m.WatermarkComponent),
    title: 'Watermark Adder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'extract-audio',
    loadComponent: () => import('./15-audio-extractor/audioExtractor.component').then(m => m.AudioExtractorComponent),
    title: 'Audio Extractor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'replace-audio',
    loadComponent: () => import('./16-audio-replacer/audioReplacer.component').then(m => m.AudioReplacerComponent),
    title: 'Audio Replacer — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'denoiser',
    loadComponent: () => import('./17-denoiser/denoiser.component').then(m => m.DenoiserComponent),
    title: 'Video Denoiser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'interpolate',
    loadComponent: () => import('./18-interpolator/interpolator.component').then(m => m.InterpolatorComponent),
    title: 'Frame Interpolator — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'metadata',
    loadComponent: () => import('./19-metadata-editor/metadataEditor.component').then(m => m.MetadataEditorComponent),
    title: 'Metadata Editor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'splitter',
    loadComponent: () => import('./20-splitter/splitter.component').then(m => m.SplitterComponent),
    title: 'Video Splitter — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'screen-recorder',
    loadComponent: () => import('./21-screen-recorder/screenRecorder.component').then(m => m.ScreenRecorderComponent),
    title: 'Screen Recorder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'to-gif',
    loadComponent: () => import('./22-video-to-gif/videoToGif.component').then(m => m.VideoToGifComponent),
    title: 'Video to GIF — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'pip',
    loadComponent: () => import('./23-pip/pip.component').then(m => m.PipComponent),
    title: 'Picture-in-Picture — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'blur',
    loadComponent: () => import('./24-blur/blur.component').then(m => m.BlurComponent),
    title: 'Video Blur — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'transitions',
    loadComponent: () => import('./25-transitions/transitions.component').then(m => m.TransitionsComponent),
    title: 'Video Transitions — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'compare',
    loadComponent: () => import('./26-compare/compare.component').then(m => m.CompareComponent),
    title: 'Video Compare — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'slideshow',
    loadComponent: () => import('./27-slideshow/slideshow.component').then(m => m.SlideshowComponent),
    title: 'Slideshow Maker — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'batch',
    loadComponent: () => import('./28-batch/batch.component').then(m => m.BatchComponent),
    title: 'Batch Processor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'analyser',
    loadComponent: () => import('./29-analyser/analyser.component').then(m => m.AnalyserComponent),
    title: 'Video Analyser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'upscaler',
    loadComponent: () => import('./30-upscaler/upscaler.component').then(m => m.UpscalerComponent),
    title: 'AI Video Upscaler — Omni-Tool',
    data: { category: 'ai' }
  },
  {
    path: '',
    loadComponent: () => import('./video.component').then(m => m.VideoComponent),
    pathMatch: 'full'
  }
];

