import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
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
import {speedControllerFeature} from './modules/video/07-speed-controller/speed-controller.store';
import {looperFeature} from './modules/video/08-looper/looper.store';
import {watermarkFeature} from './modules/video/09-watermark/watermark.store';
import {subtitleFeature} from './modules/video/10-subtitle/subtitle.store';
import {muterFeature} from './modules/video/11-muter/muter.store';
import {volumeBoosterFeature} from './modules/video/12-volume-booster/volume-booster.store';
import {audioExtractorFeature} from './modules/video/13-audio-extractor/audio-extractor.store';
import {audioRemoverFeature} from './modules/video/14-audio-remover/audio-remover.store';
import {audioReplacerFeature} from './modules/video/15-audio-replacer/audio-replacer.store';
import {flipRotateFeature} from './modules/video/09-flip-rotate/flip-rotate.store';
import {cropResizeFeature} from './modules/video/10-crop-resize/crop-resize.store';
import {colorGradingFeature} from './modules/video/11-color-grading/color-grading.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
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
      [subtitleFeature.name]: subtitleFeature.reducer,
      [muterFeature.name]: muterFeature.reducer,
      [volumeBoosterFeature.name]: volumeBoosterFeature.reducer,
      [audioExtractorFeature.name]: audioExtractorFeature.reducer,
      [audioRemoverFeature.name]: audioRemoverFeature.reducer,
      [audioReplacerFeature.name]: audioReplacerFeature.reducer,
      [flipRotateFeature.name]: flipRotateFeature.reducer,
      [cropResizeFeature.name]: cropResizeFeature.reducer,
      [colorGradingFeature.name]: colorGradingFeature.reducer
    }),
    provideEffects([AppEffects])
  ],
};
