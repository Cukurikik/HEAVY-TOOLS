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

import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(reducers),
    provideEffects([AppEffects])
  ],
};
