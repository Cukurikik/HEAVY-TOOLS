import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { AudioMeta, WaveformData, AudioErrorCode, ProcessingStatus, ExportFormat } from '../shared/types/audio.types';
import { AudioSplitterService } from './splitter.service';
import { AudioWorkerBridgeService } from '../shared/engine/worker-bridge.service';

// ── State ──
export interface AudioSplitterState {
  inputFile: File | null;
  audioMeta: AudioMeta | null;
  waveformData: WaveformData | null;
  mode:string;
  equalParts:number;
  outputFormat:ExportFormat;
  
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: AudioErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: AudioSplitterState = {
  inputFile: null, audioMeta: null, waveformData: null,
  mode:'equal'as string,equalParts:2,outputFormat:'wav'as ExportFormat,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false,
};

// ── Actions ──
export const audioSplitterActions = createActionGroup({
  source: 'AudioSplitter',
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
export const audioSplitterFeature = createFeature({
  name: 'audioSplitter',
  reducer: createReducer(
    initialState,
    on(audioSplitterActions.loadFile, (s, { file }) => ({ ...s, inputFile: file, status: 'loading' as const, errorCode: null, errorMessage: null })),
    on(audioSplitterActions.loadFileSuccess, (s, { meta, waveformData }) => ({ ...s, audioMeta: meta, waveformData, status: 'idle' as const })),
    on(audioSplitterActions.loadFileFailure, (s, { errorCode, message }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable: true })),
    on(audioSplitterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, errorCode: null, errorMessage: null })),
    on(audioSplitterActions.updateProgress, (s, { value }) => ({ ...s, progress: value })),
    on(audioSplitterActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => ({ ...s, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(audioSplitterActions.processingFailure, (s, { errorCode, message, retryable }) => ({ ...s, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(audioSplitterActions.resetState, () => initialState),
  ),
});

// ── Effects ──
@Injectable()
export class AudioSplitterEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private svc = inject(AudioSplitterService);
  private bridge = inject(AudioWorkerBridgeService);

  loadFile$ = createEffect(() => this.actions$.pipe(
    ofType(audioSplitterActions.loadFile),
    switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(
      map(({ meta, waveformData }) => audioSplitterActions.loadFileSuccess({ meta, waveformData })),
      catchError(err => of(audioSplitterActions.loadFileFailure({ errorCode: 'DECODE_FAILED', message: err?.message ?? 'Decode failed' })))
    ))
  ));

  startProcessing$ = createEffect(() => this.actions$.pipe(
    ofType(audioSplitterActions.startProcessing),
    withLatestFrom(this.store.select(audioSplitterFeature.selectAudioSplitterState)),
    exhaustMap(([, state]) => {
      if (!state.inputFile) return of(audioSplitterActions.processingFailure({ errorCode: 'INVALID_PARAMS', message: 'No input file', retryable: true }));
      return from(this.svc.processAudio(state.inputFile, {})).pipe(
        map(blob => audioSplitterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })),
        catchError(err => of(audioSplitterActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: err?.message ?? 'Processing failed', retryable: true })))
      );
    })
  ));

  download$ = createEffect(() => this.actions$.pipe(
    ofType(audioSplitterActions.downloadOutput),
    withLatestFrom(this.store.select(audioSplitterFeature.selectAudioSplitterState)),
    tap(([, state]) => {
      if (state.outputBlob && state.inputFile) {
        this.bridge.downloadBlob(state.outputBlob, 'omni_splitter_' + state.inputFile.name.replace(/\.[^.]+$/, '') + '.wav');
      }
    })
  ), { dispatch: false });
}
