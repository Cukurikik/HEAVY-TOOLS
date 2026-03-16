import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { AudioWorkerBridgeService } from '../shared/engine/worker-bridge.service';

// ── Types ──
export type ProcessingStatus = 'idle' | 'loading' | 'processing' | 'done' | 'error';
export type ExportFormat = 'wav' | 'mp3' | 'ogg';
export type AudioErrorCode = 'NETWORK_ERROR' | 'DECODE_FAILED' | 'WORKER_CRASHED' | 'INVALID_PARAMS' | 'UNKNOWN_ERROR';

export interface MusicGeneratorState {
  prompt: string;
  duration: number; // in seconds
  genre: string;
  outputFormat: ExportFormat;

  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: AudioErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: MusicGeneratorState = {
  prompt: '',
  duration: 15,
  genre: 'electronic',
  outputFormat: 'wav' as ExportFormat,

  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false,
};

// ── Actions ──
export const musicGeneratorActions = createActionGroup({
  source: 'MusicGenerator',
  events: {
    'Set Prompt': props<{ prompt: string }>(),
    'Set Duration': props<{ duration: number }>(),
    'Set Genre': props<{ genre: string }>(),
    'Start Generation': emptyProps(),
    'Update Progress': props<{ value: number }>(),
    'Generation Success': props<{ outputBlob: Blob; outputSizeMB: number }>(),
    'Generation Failure': props<{ errorCode: AudioErrorCode; message: string; retryable: boolean }>(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps(),
  }
});

// ── Feature (Reducer + Selectors) ──
export const musicGeneratorFeature = createFeature({
  name: 'musicGenerator',
  reducer: createReducer(
    initialState,
    on(musicGeneratorActions.setPrompt, (s, { prompt }) => ({ ...s, prompt })),
    on(musicGeneratorActions.setDuration, (s, { duration }) => ({ ...s, duration })),
    on(musicGeneratorActions.setGenre, (s, { genre }) => ({ ...s, genre })),
    on(musicGeneratorActions.startGeneration, s => ({ ...s, status: 'processing' as const, progress: 0, errorCode: null, errorMessage: null, outputBlob: null, outputSizeMB: null })),
    on(musicGeneratorActions.updateProgress, (s, { value }) => ({ ...s, progress: value })),
    on(musicGeneratorActions.generationSuccess, (s, { outputBlob, outputSizeMB }) => ({ ...s, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(musicGeneratorActions.generationFailure, (s, { errorCode, message, retryable }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(musicGeneratorActions.resetState, () => initialState),
  )
});

// ── Effects ──
@Injectable()
export class MusicGeneratorEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private bridge = inject(AudioWorkerBridgeService);

  startGeneration$ = createEffect(() => this.actions$.pipe(
    ofType(musicGeneratorActions.startGeneration),
    withLatestFrom(this.store.select(musicGeneratorFeature.selectMusicGeneratorState)),
    exhaustMap(([, state]) => {
      if (!state.prompt.trim()) {
        return of(musicGeneratorActions.generationFailure({ errorCode: 'INVALID_PARAMS', message: 'Please provide a prompt', retryable: true }));
      }

      // Dispatch progress updates starting immediately
      this.store.dispatch(musicGeneratorActions.updateProgress({ value: 5 }));

      return this.bridge.process<{ prompt: string; duration: number; genre: string }, Blob>(
        () => new Worker(new URL('./music-generator.worker', import.meta.url), { type: 'module' }),
        { prompt: state.prompt, duration: state.duration, genre: state.genre }
      ).pipe(
        map(msg => {
          if (msg.type === 'progress') {
            return musicGeneratorActions.updateProgress({ value: msg.value ?? 0 });
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data as Blob;
            return musicGeneratorActions.generationSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 });
          } else if (msg.type === 'error') {
            return musicGeneratorActions.generationFailure({ errorCode: msg.errorCode as AudioErrorCode || 'UNKNOWN_ERROR', message: msg.message ?? 'Generation failed', retryable: true });
          }
          return musicGeneratorActions.updateProgress({ value: 0 }); // Fallback
        }),
        catchError(err => of(musicGeneratorActions.generationFailure({ errorCode: 'WORKER_CRASHED', message: err?.message ?? 'Worker crashed', retryable: true })))
      );
    })
  ));

  download$ = createEffect(() => this.actions$.pipe(
    ofType(musicGeneratorActions.downloadOutput),
    withLatestFrom(this.store.select(musicGeneratorFeature.selectMusicGeneratorState)),
    tap(([, state]) => {
      if (state.outputBlob) {
        const safePrompt = state.prompt.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        this.bridge.downloadBlob(state.outputBlob, `omni_music_${safePrompt}.wav`);
      }
    })
  ), { dispatch: false });
}
