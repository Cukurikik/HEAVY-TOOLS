import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ColorGradingState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  gamma: number;
  lutFile: File | null;
  activeLutPreset: string | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ColorGradingState = {
  inputFile: null, videoMeta: null,
  brightness: 0,
  contrast: 1,
  saturation: 1,
  hue: 0,
  gamma: 1.0,
  lutFile: null,
  activeLutPreset: null,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ColorGradingActions = {
  loadFile: createAction('[ColorGrading] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ColorGrading] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[ColorGrading] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[ColorGrading] Update Config', props<{ config: Partial<ColorGradingState> }>()),
  startProcessing: createAction('[ColorGrading] Start'),
  updateProgress: createAction('[ColorGrading] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ColorGrading] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ColorGrading] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[ColorGrading] Download'),
  resetState: createAction('[ColorGrading] Reset'),
};
export const colorGradingFeature = createFeature({
  name: 'colorGrading',
  reducer: createReducer(init,
    on(ColorGradingActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ColorGradingActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(ColorGradingActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ColorGradingActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(ColorGradingActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(ColorGradingActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ColorGradingActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ColorGradingActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(ColorGradingActions.resetState, () => init),
  )
});
export const { selectColorGradingState, selectStatus, selectProgress, selectOutputBlob } = colorGradingFeature;
export const selectColorGradingCanProcess = createSelector(selectColorGradingState, s => !!s.inputFile && s.status === 'idle');
export const selectColorGradingIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
