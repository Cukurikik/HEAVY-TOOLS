import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface TransitionsState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  clips: { file: File; id: string }[];
  transitionList: { afterClipId: string; type: string; duration: number }[];
  applyAllType: string | null;
  applyAllDuration: number | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: TransitionsState = {
  inputFile: null, videoMeta: null,
  clips: [],
  transitionList: [],
  applyAllType: 'fade',
  applyAllDuration: 0.5,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const TransitionsActions = {
  loadFile: createAction('[Transitions] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Transitions] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Transitions] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Transitions] Update Config', props<{ config: Partial<TransitionsState> }>()),
  startProcessing: createAction('[Transitions] Start'),
  updateProgress: createAction('[Transitions] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Transitions] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Transitions] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Transitions] Download'),
  resetState: createAction('[Transitions] Reset') };
export const transitionsFeature = createFeature({
  name: 'transitions',
  reducer: createReducer(init,
    on(TransitionsActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(TransitionsActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(TransitionsActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(TransitionsActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(TransitionsActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(TransitionsActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(TransitionsActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(TransitionsActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(TransitionsActions.resetState, () => init),
  )
});
export const { selectTransitionsState, selectStatus, selectProgress, selectOutputBlob } = transitionsFeature;
export const selectTransitionsCanProcess = createSelector(selectTransitionsState, s => !!s.inputFile && s.status === 'idle');
export const selectTransitionsIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
