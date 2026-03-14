import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { AudioMeta, WaveformData, AudioErrorCode, ProcessingStatus, ExportFormat } from '../shared/types/audio.types';
import { AudioWatermarkService } from './watermark.service';
import { AudioWorkerBridgeService } from '../shared/engine/worker-bridge.service';

// ── State ──
export interface AudioWatermarkState {
  inputFile: File | null;
  audioMeta: AudioMeta | null;
  waveformData: WaveformData | null;
  mode:string;
  watermarkText:string;
  strength:number;
  outputFormat:ExportFormat;
  
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: AudioErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: AudioWatermarkState = {
  inputFile: null, audioMeta: null, waveformData: null,
  mode:'embed'as string,watermarkText:'',strength:0.5,outputFormat:'wav'as ExportFormat,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false,
};

// ── Actions ──
export const audioWatermarkActions = createActionGroup({
  source: 'AudioWatermark',
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
export const audioWatermarkFeature = createFeature({
  name: 'audioWatermark',
  reducer: createReducer(
    initialState,
    on(audioWatermarkActions.loadFile, (s, { file }) => ({ ...s, inputFile: file, status: 'loading' as const, errorCode: null, errorMessage: null })),
    on(audioWatermarkActions.loadFileSuccess, (s, { meta, waveformData }) => ({ ...s, audioMeta: meta, waveformData, status: 'idle' as const })),
    on(audioWatermarkActions.loadFileFailure, (s, { errorCode, message }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable: true })),
    on(audioWatermarkActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, errorCode: null, errorMessage: null })),
    on(audioWatermarkActions.updateProgress, (s, { value }) => ({ ...s, progress: value })),
    on(audioWatermarkActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => ({ ...s, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(audioWatermarkActions.processingFailure, (s, { errorCode, message, retryable }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(audioWatermarkActions.resetState, () => initialState),
  ),
});

// ── Effects ──
@Injectable()
export class AudioWatermarkEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private svc = inject(AudioWatermarkService);
  private bridge = inject(AudioWorkerBridgeService);

  loadFile$ = createEffect(() => this.actions$.pipe(
    ofType(audioWatermarkActions.loadFile),
    switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(
      map(({ meta, waveformData }) => audioWatermarkActions.loadFileSuccess({ meta, waveformData })),
      catchError(err => of(audioWatermarkActions.loadFileFailure({ errorCode: 'DECODE_FAILED', message: err?.message ?? 'Decode failed' })))
    ))
  ));

  startProcessing$ = createEffect(() => this.actions$.pipe(
    ofType(audioWatermarkActions.startProcessing),
    withLatestFrom(this.store.select(audioWatermarkFeature.selectAudioWatermarkState)),
    exhaustMap(([, state]) => {
      if (!state.inputFile) return of(audioWatermarkActions.processingFailure({ errorCode: 'INVALID_PARAMS', message: 'No input file', retryable: true }));
      return from(this.svc.processAudio(state.inputFile, {})).pipe(
        map(blob => audioWatermarkActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })),
        catchError(err => of(audioWatermarkActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: err?.message ?? 'Processing failed', retryable: true })))
      );
    })
  ));

  download$ = createEffect(() => this.actions$.pipe(
    ofType(audioWatermarkActions.downloadOutput),
    withLatestFrom(this.store.select(audioWatermarkFeature.selectAudioWatermarkState)),
    tap(([, state]) => {
      if (state.outputBlob && state.inputFile) {
        this.bridge.downloadBlob(state.outputBlob, 'omni_watermark_' + state.inputFile.name.replace(/\.[^.]+$/, '') + '.wav');
      }
    })
  ), { dispatch: false });
}
