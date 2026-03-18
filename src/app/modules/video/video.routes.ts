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
    loadChildren: () => Promise.all([
      import('./01-trimmer'),
      import('./01-trimmer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TrimmerComponent,
        providers: [provideState(s.trimmerFeature)]
      }
    ]),
    title: 'Video Trimmer — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'merger',
    loadChildren: () => Promise.all([
      import('./02-merger'),
      import('./02-merger')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.MergerComponent,
        providers: [provideState(s.mergerFeature)]
      }
    ]),
    title: 'Video Merger — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'converter',
    loadChildren: () => Promise.all([
      import('./03-converter'),
      import('./03-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ConverterComponent,
        providers: [provideState(s.converterFeature)]
      }
    ]),
    title: 'Format Converter — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'compressor',
    loadChildren: () => Promise.all([
      import('./04-compressor'),
      import('./04-compressor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CompressorComponent,
        providers: [provideState(s.compressorFeature)]
      }
    ]),
    title: 'Video Compressor — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'stabilizer',
    loadChildren: () => Promise.all([
      import('./05-stabilizer'),
      import('./05-stabilizer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.StabilizerComponent,
        providers: [provideState(s.stabilizerFeature)]
      }
    ]),
    title: 'Video Stabilizer — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'reverser',
    loadChildren: () => Promise.all([
      import('./06-reverser'),
      import('./06-reverser')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ReverserComponent,
        providers: [provideState(s.reverserFeature)]
      }
    ]),
    title: 'Video Reverser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'speed',
    loadChildren: () => Promise.all([
      import('./07-speed-controller'),
      import('./07-speed-controller')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SpeedControllerComponent,
        providers: [provideState(s.speedControllerFeature)]
      }
    ]),
    title: 'Speed Controller — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'looper',
    loadChildren: () => Promise.all([
      import('./08-looper'),
      import('./08-looper')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.LooperComponent,
        providers: [provideState(s.looperFeature)]
      }
    ]),
    title: 'Video Looper — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'flip-rotate',
    loadChildren: () => Promise.all([
      import('./09-flip-rotate'),
      import('./09-flip-rotate')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.FlipRotateComponent,
        providers: [provideState(s.flipRotateFeature)]
      }
    ]),
    title: 'Flip & Rotate — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'crop-resize',
    loadChildren: () => Promise.all([
      import('./10-crop-resize'),
      import('./10-crop-resize')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CropResizeComponent,
        providers: [provideState(s.cropResizeFeature)]
      }
    ]),
    title: 'Smart Crop & Resize — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'color-grading',
    loadChildren: () => Promise.all([
      import('./11-color-grading'),
      import('./11-color-grading')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ColorGradingComponent,
        providers: [provideState(s.colorGradingFeature)]
      }
    ]),
    title: 'Color Grading — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'subtitles',
    loadChildren: () => Promise.all([
      import('./12-subtitle-burner'),
      import('./12-subtitle-burner')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SubtitleBurnerComponent,
        providers: [provideState(s.subtitleBurnerFeature)]
      }
    ]),
    title: 'Subtitle Burner — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'thumbnail',
    loadChildren: () => Promise.all([
      import('./13-thumbnail-generator'),
      import('./13-thumbnail-generator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ThumbnailGeneratorComponent,
        providers: [provideState(s.thumbnailGeneratorFeature)]
      }
    ]),
    title: 'Thumbnail Generator — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'watermark',
    loadChildren: () => Promise.all([
      import('./14-watermark'),
      import('./14-watermark')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.WatermarkComponent,
        providers: [provideState(s.watermarkFeature)]
      }
    ]),
    title: 'Watermark Adder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'extract-audio',
    loadChildren: () => Promise.all([
      import('./15-audio-extractor'),
      import('./15-audio-extractor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioExtractorComponent,
        providers: [provideState(s.audioExtractorFeature)]
      }
    ]),
    title: 'Audio Extractor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'replace-audio',
    loadChildren: () => Promise.all([
      import('./16-audio-replacer'),
      import('./16-audio-replacer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioReplacerComponent,
        providers: [provideState(s.audioReplacerFeature)]
      }
    ]),
    title: 'Audio Replacer — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'denoiser',
    loadChildren: () => Promise.all([
      import('./17-denoiser'),
      import('./17-denoiser')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.DenoiserComponent,
        providers: [provideState(s.denoiserFeature)]
      }
    ]),
    title: 'Video Denoiser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'interpolate',
    loadChildren: () => Promise.all([
      import('./18-interpolator'),
      import('./18-interpolator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.InterpolatorComponent,
        providers: [provideState(s.interpolatorFeature)]
      }
    ]),
    title: 'Frame Interpolator — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'metadata',
    loadChildren: () => Promise.all([
      import('./19-metadata-editor'),
      import('./19-metadata-editor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.MetadataEditorComponent,
        providers: [provideState(s.metadataEditorFeature)]
      }
    ]),
    title: 'Metadata Editor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'splitter',
    loadChildren: () => Promise.all([
      import('./20-splitter'),
      import('./20-splitter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SplitterComponent,
        providers: [provideState(s.splitterFeature)]
      }
    ]),
    title: 'Video Splitter — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'screen-recorder',
    loadChildren: () => Promise.all([
      import('./21-screen-recorder'),
      import('./21-screen-recorder')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ScreenRecorderComponent,
        providers: [provideState(s.screenRecorderFeature)]
      }
    ]),
    title: 'Screen Recorder — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'to-gif',
    loadChildren: () => Promise.all([
      import('./22-video-to-gif'),
      import('./22-video-to-gif')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.VideoToGifComponent,
        providers: [provideState(s.videoToGifFeature)]
      }
    ]),
    title: 'Video to GIF — Omni-Tool',
    data: { category: 'basic' }
  },
  {
    path: 'pip',
    loadChildren: () => Promise.all([
      import('./23-pip'),
      import('./23-pip')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.PipComponent,
        providers: [provideState(s.pipFeature)]
      }
    ]),
    title: 'Picture-in-Picture — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'blur',
    loadChildren: () => Promise.all([
      import('./24-blur'),
      import('./24-blur')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.BlurComponent,
        providers: [provideState(s.blurFeature)]
      }
    ]),
    title: 'Video Blur — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'transitions',
    loadChildren: () => Promise.all([
      import('./25-transitions'),
      import('./25-transitions')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TransitionsComponent,
        providers: [provideState(s.transitionsFeature)]
      }
    ]),
    title: 'Video Transitions — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'compare',
    loadChildren: () => Promise.all([
      import('./26-compare'),
      import('./26-compare')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CompareComponent,
        providers: [provideState(s.compareFeature)]
      }
    ]),
    title: 'Video Compare — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'slideshow',
    loadChildren: () => Promise.all([
      import('./27-slideshow'),
      import('./27-slideshow')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SlideshowComponent,
        providers: [provideState(s.slideshowFeature)]
      }
    ]),
    title: 'Slideshow Maker — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'batch',
    loadChildren: () => Promise.all([
      import('./28-batch'),
      import('./28-batch')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.BatchComponent,
        providers: [provideState(s.batchFeature)]
      }
    ]),
    title: 'Batch Processor — Omni-Tool',
    data: { category: 'pro' }
  },
  {
    path: 'analyser',
    loadChildren: () => Promise.all([
      import('./29-analyser'),
      import('./29-analyser')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AnalyserComponent,
        providers: [provideState(s.analyserFeature)]
      }
    ]),
    title: 'Video Analyser — Omni-Tool',
    data: { category: 'advanced' }
  },
  {
    path: 'upscaler',
    loadChildren: () => Promise.all([
      import('./30-upscaler'),
      import('./30-upscaler')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.UpscalerComponent,
        providers: [provideState(s.upscalerFeature)]
      }
    ]),
    title: 'AI Video Upscaler — Omni-Tool',
    data: { category: 'ai' }
  }
];
