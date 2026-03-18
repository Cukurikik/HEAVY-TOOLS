import {
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';

import {routes} from './app.routes';
import {reducers} from './store/app.state';
import {AppEffects} from './store/app.effects';
import {mergerFeature} from './modules/video/02-merger/merger.store';
import {converterFeature} from './modules/video/03-converter/converter.store';
import {trimmerFeature} from './modules/video/01-trimmer/trimmer.store';
import {compressorFeature} from './modules/video/04-compressor/compressor.store';
import {stabilizerFeature} from './modules/video/05-stabilizer/stabilizer.store';
import {reverserFeature} from './modules/video/06-reverser/reverser.store';
import {speedControllerFeature} from './modules/video/07-speed-controller/speedController.store';
import {looperFeature} from './modules/video/08-looper/looper.store';
import {watermarkFeature} from './modules/video/14-watermark/watermark.store';
import {subtitleBurnerFeature} from './modules/video/12-subtitle-burner/subtitleBurner.store';
import {audioExtractorFeature} from './modules/video/15-audio-extractor/audioExtractor.store';
import {audioReplacerFeature} from './modules/video/16-audio-replacer/audioReplacer.store';
import {flipRotateFeature} from './modules/video/09-flip-rotate/flipRotate.store';
import {cropResizeFeature} from './modules/video/10-crop-resize/cropResize.store';
import {colorGradingFeature} from './modules/video/11-color-grading/colorGrading.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(), // Adding HttpClient support
    provideRouter(routes),
    provideStore({ 
      ...reducers, 
      [mergerFeature.name]: mergerFeature.reducer,
      [converterFeature.name]: converterFeature.reducer,
      [trimmerFeature.name]: trimmerFeature.reducer,
      [compressorFeature.name]: compressorFeature.reducer,
      [stabilizerFeature.name]: stabilizerFeature.reducer,
      [reverserFeature.name]: reverserFeature.reducer,
      [speedControllerFeature.name]: speedControllerFeature.reducer,
      [looperFeature.name]: looperFeature.reducer,
      [watermarkFeature.name]: watermarkFeature.reducer,
      [subtitleBurnerFeature.name]: subtitleBurnerFeature.reducer,
      [audioExtractorFeature.name]: audioExtractorFeature.reducer,
      [audioReplacerFeature.name]: audioReplacerFeature.reducer,
      [flipRotateFeature.name]: flipRotateFeature.reducer,
      [cropResizeFeature.name]: cropResizeFeature.reducer,
      [colorGradingFeature.name]: colorGradingFeature.reducer
    }),
    provideEffects([AppEffects])
  ],
};