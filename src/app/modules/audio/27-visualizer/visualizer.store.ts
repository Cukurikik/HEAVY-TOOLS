import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { AudioMeta, WaveformData, AudioErrorCode, ProcessingStatus, ExportFormat } from '../shared/types/audio.types';
import { AudioVisualizerService } from './visualizer.service';
import { AudioWorkerBridgeService } from '../shared/engine/worker-bridge.service';

// ── State ──
export interface AudioVisualizerState {
  inputFile: File | null;
  audioMeta: AudioMeta | null;
  waveformData: WaveformData | null;
  style:string;
  colorTheme:string;
  resolution:string;
  fps:number;
  outputFormat:ExportFormat;
  
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: AudioErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: AudioVisualizerState = {
  inputFile: null, audioMeta: null, waveformData: null,
  style:'bars'as string,colorTheme:'cyan',resolution:'1080p'as string,fps:30,outputFormat:'mp4'as ExportFormat,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false,
};

// ── Actions ──
export const audioVisualizerActions = createActionGroup({
  source: 'AudioVisualizer',
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
export const audioVisualizerFeature = createFeature({
  name: 'audioVisualizer',
  reducer: createReducer(
    initialState,
    on(audioVisualizerActions.loadFile, (s, { file }) => ({ ...s, inputFile: file, status: 'loading' as const, errorCode: null, errorMessage: null })),
    on(audioVisualizerActions.loadFileSuccess, (s, { meta, waveformData }) => ({ ...s, audioMeta: meta, waveformData, status: 'idle' as const })),
    on(audioVisualizerActions.loadFileFailure, (s, { errorCode, message }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable: true })),
    on(audioVisualizerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, errorCode: null, errorMessage: null })),
    on(audioVisualizerActions.updateProgress, (s, { value }) => ({ ...s, progress: value })),
    on(audioVisualizerActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => ({ ...s, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(audioVisualizerActions.processingFailure, (s, { errorCode, message, retryable }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(audioVisualizerActions.resetState, () => initialState),
  ),
});

// ── Effects ──
@Injectable()
export class AudioVisualizerEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private svc = inject(AudioVisualizerService);
  private bridge = inject(AudioWorkerBridgeService);

  loadFile$ = createEffect(() => this.actions$.pipe(
    ofType(audioVisualizerActions.loadFile),
    switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(
      map(({ meta, waveformData }) => audioVisualizerActions.loadFileSuccess({ meta, waveformData })),
      catchError(err => of(audioVisualizerActions.loadFileFailure({ errorCode: 'DECODE_FAILED', message: err?.message ?? 'Decode failed' })))
    ))
  ));

  startProcessing$ = createEffect(() => this.actions$.pipe(
    ofType(audioVisualizerActions.startProcessing),
    withLatestFrom(this.store.select(audioVisualizerFeature.selectAudioVisualizerState)),
    exhaustMap(([, state]) => {
      if (!state.inputFile) return of(audioVisualizerActions.processingFailure({ errorCode: 'INVALID_PARAMS', message: 'No input file', retryable: true }));
      return from(this.svc.processAudio(state.inputFile, {})).pipe(
        map(blob => audioVisualizerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })),
        catchError(err => of(audioVisualizerActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: err?.message ?? 'Processing failed', retryable: true })))
      );
    })
  ));

  download$ = createEffect(() => this.actions$.pipe(
    ofType(audioVisualizerActions.downloadOutput),
    withLatestFrom(this.store.select(audioVisualizerFeature.selectAudioVisualizerState)),
    tap(([, state]) => {
      if (state.outputBlob && state.inputFile) {
        this.bridge.downloadBlob(state.outputBlob, 'omni_visualizer_' + state.inputFile.name.replace(/\.[^.]+$/, '') + '.wav');
      }
    })
  ), { dispatch: false });
}
