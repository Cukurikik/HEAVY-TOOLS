import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { AudioMeta, WaveformData, AudioErrorCode, ProcessingStatus, ExportFormat } from '../shared/types/audio.types';
import { AudioLooperService } from './looper.service';
import { AudioWorkerBridgeService } from '../shared/engine/worker-bridge.service';

// ── State ──
export interface AudioLooperState {
  inputFile: File | null;
  audioMeta: AudioMeta | null;
  waveformData: WaveformData | null;
  loopStart:number;
  loopEnd:number;
  crossfadeDuration:number;
  repeatCount:number;
  outputFormat:ExportFormat;
  
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: AudioErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: AudioLooperState = {
  inputFile: null, audioMeta: null, waveformData: null,
  loopStart:0,loopEnd:0,crossfadeDuration:0.5,repeatCount:2,outputFormat:'wav'as ExportFormat,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false,
};

// ── Actions ──
export const audioLooperActions = createActionGroup({
  source: 'AudioLooper',
  events: {
    'Load File': props<{ file: File }>(),
    'Load File Success': props<{ meta: AudioMeta; waveformData: WaveformData }>(),
    'Load File Failure': props<{ errorCode: AudioErrorCode; message: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ value: number }>(),
    'Processing Success': props<{ outputBlob: Blob; outputSizeMB: number }>(),
    'Processing Failure': props<{ errorCode: AudioErrorCode; message: string; retryable: boolean }>(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps(),
  }
});

// ── Feature (Reducer + Selectors) ──
export const audioLooperFeature = createFeature({
  name: 'audioLooper',
  reducer: createReducer(
    initialState,
    on(audioLooperActions.loadFile, (s, { file }) => ({ ...s, inputFile: file, status: 'loading' as const, errorCode: null, errorMessage: null })),
    on(audioLooperActions.loadFileSuccess, (s, { meta, waveformData }) => ({ ...s, audioMeta: meta, waveformData, status: 'idle' as const })),
    on(audioLooperActions.loadFileFailure, (s, { errorCode, message }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable: true })),
    on(audioLooperActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, errorCode: null, errorMessage: null })),
    on(audioLooperActions.updateProgress, (s, { value }) => ({ ...s, progress: value })),
    on(audioLooperActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => ({ ...s, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(audioLooperActions.processingFailure, (s, { errorCode, message, retryable }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(audioLooperActions.resetState, () => initialState),
  ),
});

// ── Effects ──
@Injectable()
export class AudioLooperEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private svc = inject(AudioLooperService);
  private bridge = inject(AudioWorkerBridgeService);

  loadFile$ = createEffect(() => this.actions$.pipe(
    ofType(audioLooperActions.loadFile),
    switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(
      map(({ meta, waveformData }) => audioLooperActions.loadFileSuccess({ meta, waveformData })),
      catchError(err => of(audioLooperActions.loadFileFailure({ errorCode: 'DECODE_FAILED', message: err?.message ?? 'Decode failed' })))
    ))
  ));

  startProcessing$ = createEffect(() => this.actions$.pipe(
    ofType(audioLooperActions.startProcessing),
    withLatestFrom(this.store.select(audioLooperFeature.selectAudioLooperState)),
    exhaustMap(([, state]) => {
      if (!state.inputFile) return of(audioLooperActions.processingFailure({ errorCode: 'INVALID_PARAMS', message: 'No input file', retryable: true }));
      return from(this.svc.processAudio(state.inputFile, {})).pipe(
        map(blob => audioLooperActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })),
        catchError(err => of(audioLooperActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: err?.message ?? 'Processing failed', retryable: true })))
      );
    })
  ));

  download$ = createEffect(() => this.actions$.pipe(
    ofType(audioLooperActions.downloadOutput),
    withLatestFrom(this.store.select(audioLooperFeature.selectAudioLooperState)),
    tap(([, state]) => {
      if (state.outputBlob && state.inputFile) {
        this.bridge.downloadBlob(state.outputBlob, 'omni_looper_' + state.inputFile.name.replace(/\.[^.]+$/, '') + '.wav');
      }
    })
  ), { dispatch: false });
}
