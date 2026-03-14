import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { imageMatrixFeature } from './store/image.reducer';
import { ImageEffects } from './store/image.effects';

export const IMAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(imageMatrixFeature), provideEffects(ImageEffects)],
    children: [
      { path: '', loadComponent: () => import('./image-matrix.component').then(m => m.ImageMatrixComponent) },
      { path: 'generator', loadComponent: () => import('./components/ai-generator/ai-generator.component').then(m => m.AiGeneratorComponent) },
      { path: 'enhancer', loadComponent: () => import('./components/ai-enhancer/ai-enhancer.component').then(m => m.AiEnhancerComponent) },
      { path: 'restorer', loadComponent: () => import('./components/ai-restorer/ai-restorer.component').then(m => m.AiRestorerComponent) },
      { path: 'bg-remover', loadComponent: () => import('./components/bg-remover/bg-remover.component').then(m => m.BgRemoverComponent) },
      { path: 'auto-enhance', loadComponent: () => import('./components/auto-enhance/auto-enhance.component').then(m => m.AutoEnhanceComponent) },
      { path: 'auto-crop', loadComponent: () => import('./components/auto-crop/auto-crop.component').then(m => m.AutoCropComponent) },
      { path: 'format-converter', loadComponent: () => import('./components/format-converter/format-converter.component').then(m => m.FormatConverterComponent) },
      { path: 'heic-converter', loadComponent: () => import('./components/heic-converter/heic-converter.component').then(m => m.HeicConverterComponent) },
      { path: 'svg-to-raster', loadComponent: () => import('./components/svg-to-raster/svg-to-raster.component').then(m => m.SvgToRasterComponent) },
      { path: 'image-to-pdf', loadComponent: () => import('./components/image-to-pdf/image-to-pdf.component').then(m => m.ImageToPdfComponent) },
      { path: 'base64-codec', loadComponent: () => import('./components/base64-codec/base64-codec.component').then(m => m.Base64CodecComponent) },
      { path: 'smart-cropper', loadComponent: () => import('./components/smart-cropper/smart-cropper.component').then(m => m.SmartCropperComponent) },
      { path: 'resizer', loadComponent: () => import('./components/image-resizer/image-resizer.component').then(m => m.ImageResizerComponent) },
      { path: 'rotator-flipper', loadComponent: () => import('./components/rotator-flipper/rotator-flipper.component').then(m => m.RotatorFlipperComponent) },
      { path: 'grid-splitter', loadComponent: () => import('./components/grid-splitter/grid-splitter.component').then(m => m.GridSplitterComponent) },
      { path: 'palette-extractor', loadComponent: () => import('./components/palette-extractor/palette-extractor.component').then(m => m.PaletteExtractorComponent) },
      { path: 'glitch-effect', loadComponent: () => import('./components/glitch-effect/glitch-effect.component').then(m => m.GlitchEffectComponent) },
      { path: 'pixelator', loadComponent: () => import('./components/pixelator/pixelator.component').then(m => m.PixelatorComponent) },
      { path: 'lut-grader', loadComponent: () => import('./components/lut-grader/lut-grader.component').then(m => m.LutGraderComponent) },
      { path: 'colorizer', loadComponent: () => import('./components/colorizer/colorizer.component').then(m => m.ColorizerComponent) },
      { path: 'compressor', loadComponent: () => import('./components/image-compressor/image-compressor.component').then(m => m.ImageCompressorComponent) },
      { path: 'exif-viewer', loadComponent: () => import('./components/exif-viewer/exif-viewer.component').then(m => m.ExifViewerComponent) },
      { path: 'exif-stripper', loadComponent: () => import('./components/exif-stripper/exif-stripper.component').then(m => m.ExifStripperComponent) },
      { path: 'watermark-adder', loadComponent: () => import('./components/watermark-adder/watermark-adder.component').then(m => m.WatermarkAdderComponent) },
      { path: 'watermark-remover', loadComponent: () => import('./components/watermark-remover/watermark-remover.component').then(m => m.WatermarkRemoverComponent) },
      { path: 'blur-censor', loadComponent: () => import('./components/blur-censor/blur-censor.component').then(m => m.BlurCensorComponent) },
      { path: 'meme-generator', loadComponent: () => import('./components/meme-generator/meme-generator.component').then(m => m.MemeGeneratorComponent) },
      { path: 'collage-maker', loadComponent: () => import('./components/collage-maker/collage-maker.component').then(m => m.CollageMakerComponent) },
      { path: 'gif-maker', loadComponent: () => import('./components/gif-maker/gif-maker.component').then(m => m.GifMakerComponent) },
      { path: 'frame-extractor', loadComponent: () => import('./components/frame-extractor/frame-extractor.component').then(m => m.FrameExtractorComponent) }
    ]
  }
];
