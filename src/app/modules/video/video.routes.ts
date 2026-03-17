// ============================================================
// VIDEO ROUTES — All 30 features registered
// File: src/app/modules/video/video.routes.ts
// ============================================================

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { trimmerFeature } from './01-trimmer';
import { mergerFeature } from './02-merger';
import { converterFeature } from './03-converter';
import { compressorFeature } from './04-compressor';
import { stabilizerFeature } from './05-stabilizer';
import { reverserFeature } from './06-reverser';
import { speedControllerFeature } from './07-speed-controller';
import { looperFeature } from './08-looper';
import { flipRotateFeature } from './09-flip-rotate';
import { cropResizeFeature } from './10-crop-resize';
import { colorGradingFeature } from './11-color-grading';
import { subtitleBurnerFeature } from './12-subtitle-burner';
import { thumbnailGeneratorFeature } from './13-thumbnail-generator';
import { watermarkFeature } from './14-watermark';
import { audioExtractorFeature } from './15-audio-extractor';
import { audioReplacerFeature } from './16-audio-replacer';
import { denoiserFeature } from './17-denoiser';
import { interpolatorFeature } from './18-interpolator';
import { metadataEditorFeature } from './19-metadata-editor';
import { splitterFeature } from './20-splitter';
import { screenRecorderFeature } from './21-screen-recorder';
import { videoToGifFeature } from './22-video-to-gif';
import { pipFeature } from './23-pip';
import { blurFeature } from './24-blur';
import { transitionsFeature } from './25-transitions';
import { compareFeature } from './26-compare';
import { slideshowFeature } from './27-slideshow';
import { batchFeature } from './28-batch';
import { analyserFeature } from './29-analyser';
import { upscalerFeature } from './30-upscaler';

export const VIDEO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./video.component').then(m => m.VideoComponent),
    title: 'Video Engine — Omni-Tool'
  },
  {
    path: 'trimmer',
    loadComponent: () => import('./01-trimmer').then(m => m.TrimmerComponent),
    providers: [provideState(trimmerFeature)],
    title: 'Video Trimmer — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'merger',
    loadComponent: () => import('./02-merger').then(m => m.MergerComponent),
    providers: [provideState(mergerFeature)],
    title: 'Video Merger — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'converter',
    loadComponent: () => import('./03-converter').then(m => m.ConverterComponent),
    providers: [provideState(converterFeature)],
    title: 'Format Converter — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'compressor',
    loadComponent: () => import('./04-compressor').then(m => m.CompressorComponent),
    providers: [provideState(compressorFeature)],
    title: 'Video Compressor — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'stabilizer',
    loadComponent: () => import('./05-stabilizer').then(m => m.StabilizerComponent),
    providers: [provideState(stabilizerFeature)],
    title: 'Video Stabilizer — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'reverser',
    loadComponent: () => import('./06-reverser').then(m => m.ReverserComponent),
    providers: [provideState(reverserFeature)],
    title: 'Video Reverser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'speed',
    loadComponent: () => import('./07-speed-controller').then(m => m.SpeedControllerComponent),
    providers: [provideState(speedControllerFeature)],
    title: 'Speed Controller — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'looper',
    loadComponent: () => import('./08-looper').then(m => m.LooperComponent),
    providers: [provideState(looperFeature)],
    title: 'Video Looper — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'flip-rotate',
    loadComponent: () => import('./09-flip-rotate').then(m => m.FlipRotateComponent),
    providers: [provideState(flipRotateFeature)],
    title: 'Flip & Rotate — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'crop-resize',
    loadComponent: () => import('./10-crop-resize').then(m => m.CropResizeComponent),
    providers: [provideState(cropResizeFeature)],
    title: 'Smart Crop & Resize — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'color-grading',
    loadComponent: () => import('./11-color-grading').then(m => m.ColorGradingComponent),
    providers: [provideState(colorGradingFeature)],
    title: 'Color Grading — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'subtitles',
    loadComponent: () => import('./12-subtitle-burner').then(m => m.SubtitleBurnerComponent),
    providers: [provideState(subtitleBurnerFeature)],
    title: 'Subtitle Burner — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'thumbnail',
    loadComponent: () => import('./13-thumbnail-generator').then(m => m.ThumbnailGeneratorComponent),
    providers: [provideState(thumbnailGeneratorFeature)],
    title: 'Thumbnail Generator — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'watermark',
    loadComponent: () => import('./14-watermark').then(m => m.WatermarkComponent),
    providers: [provideState(watermarkFeature)],
    title: 'Watermark Adder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'extract-audio',
    loadComponent: () => import('./15-audio-extractor').then(m => m.AudioExtractorComponent),
    providers: [provideState(audioExtractorFeature)],
    title: 'Audio Extractor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'replace-audio',
    loadComponent: () => import('./16-audio-replacer').then(m => m.AudioReplacerComponent),
    providers: [provideState(audioReplacerFeature)],
    title: 'Audio Replacer — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'denoiser',
    loadComponent: () => import('./17-denoiser').then(m => m.DenoiserComponent),
    providers: [provideState(denoiserFeature)],
    title: 'Video Denoiser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'interpolate',
    loadComponent: () => import('./18-interpolator').then(m => m.InterpolatorComponent),
    providers: [provideState(interpolatorFeature)],
    title: 'Frame Interpolator — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'metadata',
    loadComponent: () => import('./19-metadata-editor').then(m => m.MetadataEditorComponent),
    providers: [provideState(metadataEditorFeature)],
    title: 'Metadata Editor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'splitter',
    loadComponent: () => import('./20-splitter').then(m => m.SplitterComponent),
    providers: [provideState(splitterFeature)],
    title: 'Video Splitter — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'screen-recorder',
    loadComponent: () => import('./21-screen-recorder').then(m => m.ScreenRecorderComponent),
    providers: [provideState(screenRecorderFeature)],
    title: 'Screen Recorder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'to-gif',
    loadComponent: () => import('./22-video-to-gif').then(m => m.VideoToGifComponent),
    providers: [provideState(videoToGifFeature)],
    title: 'Video to GIF — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'pip',
    loadComponent: () => import('./23-pip').then(m => m.PipComponent),
    providers: [provideState(pipFeature)],
    title: 'Picture-in-Picture — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'blur',
    loadComponent: () => import('./24-blur').then(m => m.BlurComponent),
    providers: [provideState(blurFeature)],
    title: 'Video Blur — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'transitions',
    loadComponent: () => import('./25-transitions').then(m => m.TransitionsComponent),
    providers: [provideState(transitionsFeature)],
    title: 'Video Transitions — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'compare',
    loadComponent: () => import('./26-compare').then(m => m.CompareComponent),
    providers: [provideState(compareFeature)],
    title: 'Video Compare — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'slideshow',
    loadComponent: () => import('./27-slideshow').then(m => m.SlideshowComponent),
    providers: [provideState(slideshowFeature)],
    title: 'Slideshow Maker — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'batch',
    loadComponent: () => import('./28-batch').then(m => m.BatchComponent),
    providers: [provideState(batchFeature)],
    title: 'Batch Processor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'analyser',
    loadComponent: () => import('./29-analyser').then(m => m.AnalyserComponent),
    providers: [provideState(analyserFeature)],
    title: 'Video Analyser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'upscaler',
    loadComponent: () => import('./30-upscaler').then(m => m.UpscalerComponent),
    providers: [provideState(upscalerFeature)],
    title: 'AI Video Upscaler — Omni-Tool',
    data: { category: 'ai' }
  }
];
