// ============================================================
// VIDEO ROUTES — All 30 features registered
// File: src/app/modules/video/video.routes.ts
// ============================================================

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';

export const VIDEO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./video.component').then(m => m.VideoComponent),
    title: 'Video Engine — Omni-Tool'
  },
  {
    path: 'trimmer',
    loadComponent: () => import('./01-trimmer').then(m => m.TrimmerComponent),
    providers: [provideState(import('./01-trimmer').then(m => m.trimmerFeature))],
    title: 'Video Trimmer — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'merger',
    loadComponent: () => import('./02-merger').then(m => m.MergerComponent),
    providers: [provideState(import('./02-merger').then(m => m.mergerFeature))],
    title: 'Video Merger — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'converter',
    loadComponent: () => import('./03-converter').then(m => m.ConverterComponent),
    providers: [provideState(import('./03-converter').then(m => m.converterFeature))],
    title: 'Format Converter — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'compressor',
    loadComponent: () => import('./04-compressor').then(m => m.CompressorComponent),
    providers: [provideState(import('./04-compressor').then(m => m.compressorFeature))],
    title: 'Video Compressor — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'stabilizer',
    loadComponent: () => import('./05-stabilizer').then(m => m.StabilizerComponent),
    providers: [provideState(import('./05-stabilizer').then(m => m.stabilizerFeature))],
    title: 'Video Stabilizer — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'reverser',
    loadComponent: () => import('./06-reverser').then(m => m.ReverserComponent),
    providers: [provideState(import('./06-reverser').then(m => m.reverserFeature))],
    title: 'Video Reverser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'speed',
    loadComponent: () => import('./07-speed-controller').then(m => m.SpeedControllerComponent),
    providers: [provideState(import('./07-speed-controller').then(m => m.speedControllerFeature))],
    title: 'Speed Controller — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'looper',
    loadComponent: () => import('./08-looper').then(m => m.LooperComponent),
    providers: [provideState(import('./08-looper').then(m => m.looperFeature))],
    title: 'Video Looper — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'flip-rotate',
    loadComponent: () => import('./09-flip-rotate').then(m => m.FlipRotateComponent),
    providers: [provideState(import('./09-flip-rotate').then(m => m.flipRotateFeature))],
    title: 'Flip & Rotate — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'crop-resize',
    loadComponent: () => import('./10-crop-resize').then(m => m.CropResizeComponent),
    providers: [provideState(import('./10-crop-resize').then(m => m.cropResizeFeature))],
    title: 'Smart Crop & Resize — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'color-grading',
    loadComponent: () => import('./11-color-grading').then(m => m.ColorGradingComponent),
    providers: [provideState(import('./11-color-grading').then(m => m.colorGradingFeature))],
    title: 'Color Grading — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'subtitles',
    loadComponent: () => import('./12-subtitle-burner').then(m => m.SubtitleBurnerComponent),
    providers: [provideState(import('./12-subtitle-burner').then(m => m.subtitleBurnerFeature))],
    title: 'Subtitle Burner — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'thumbnail',
    loadComponent: () => import('./13-thumbnail-generator').then(m => m.ThumbnailGeneratorComponent),
    providers: [provideState(import('./13-thumbnail-generator').then(m => m.thumbnailGeneratorFeature))],
    title: 'Thumbnail Generator — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'watermark',
    loadComponent: () => import('./14-watermark').then(m => m.WatermarkComponent),
    providers: [provideState(import('./14-watermark').then(m => m.watermarkFeature))],
    title: 'Watermark Adder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'extract-audio',
    loadComponent: () => import('./15-audio-extractor').then(m => m.AudioExtractorComponent),
    providers: [provideState(import('./15-audio-extractor').then(m => m.audioExtractorFeature))],
    title: 'Audio Extractor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'replace-audio',
    loadComponent: () => import('./16-audio-replacer').then(m => m.AudioReplacerComponent),
    providers: [provideState(import('./16-audio-replacer').then(m => m.audioReplacerFeature))],
    title: 'Audio Replacer — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'denoiser',
    loadComponent: () => import('./17-denoiser').then(m => m.DenoiserComponent),
    providers: [provideState(import('./17-denoiser').then(m => m.denoiserFeature))],
    title: 'Video Denoiser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'interpolate',
    loadComponent: () => import('./18-interpolator').then(m => m.InterpolatorComponent),
    providers: [provideState(import('./18-interpolator').then(m => m.interpolatorFeature))],
    title: 'Frame Interpolator — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'metadata',
    loadComponent: () => import('./19-metadata-editor').then(m => m.MetadataEditorComponent),
    providers: [provideState(import('./19-metadata-editor').then(m => m.metadataEditorFeature))],
    title: 'Metadata Editor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'splitter',
    loadComponent: () => import('./20-splitter').then(m => m.SplitterComponent),
    providers: [provideState(import('./20-splitter').then(m => m.splitterFeature))],
    title: 'Video Splitter — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'screen-recorder',
    loadComponent: () => import('./21-screen-recorder').then(m => m.ScreenRecorderComponent),
    providers: [provideState(import('./21-screen-recorder').then(m => m.screenRecorderFeature))],
    title: 'Screen Recorder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'to-gif',
    loadComponent: () => import('./22-video-to-gif').then(m => m.VideoToGifComponent),
    providers: [provideState(import('./22-video-to-gif').then(m => m.videoToGifFeature))],
    title: 'Video to GIF — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'pip',
    loadComponent: () => import('./23-pip').then(m => m.PipComponent),
    providers: [provideState(import('./23-pip').then(m => m.pipFeature))],
    title: 'Picture-in-Picture — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'blur',
    loadComponent: () => import('./24-blur').then(m => m.BlurComponent),
    providers: [provideState(import('./24-blur').then(m => m.blurFeature))],
    title: 'Video Blur — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'transitions',
    loadComponent: () => import('./25-transitions').then(m => m.TransitionsComponent),
    providers: [provideState(import('./25-transitions').then(m => m.transitionsFeature))],
    title: 'Video Transitions — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'compare',
    loadComponent: () => import('./26-compare').then(m => m.CompareComponent),
    providers: [provideState(import('./26-compare').then(m => m.compareFeature))],
    title: 'Video Compare — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'slideshow',
    loadComponent: () => import('./27-slideshow').then(m => m.SlideshowComponent),
    providers: [provideState(import('./27-slideshow').then(m => m.slideshowFeature))],
    title: 'Slideshow Maker — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'batch',
    loadComponent: () => import('./28-batch').then(m => m.BatchComponent),
    providers: [provideState(import('./28-batch').then(m => m.batchFeature))],
    title: 'Batch Processor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'analyser',
    loadComponent: () => import('./29-analyser').then(m => m.AnalyserComponent),
    providers: [provideState(import('./29-analyser').then(m => m.analyserFeature))],
    title: 'Video Analyser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'upscaler',
    loadComponent: () => import('./30-upscaler').then(m => m.UpscalerComponent),
    providers: [provideState(import('./30-upscaler').then(m => m.upscalerFeature))],
    title: 'AI Video Upscaler — Omni-Tool',
    data: { category: 'ai' }
  }
];
