import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface CompareState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  fileA: File | null;
  fileB: File | null;
  mode: 'sidebyside' | 'divider' | 'difference';
  dividerPosition: number;
  syncPlayback: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: CompareState = {
  inputFile: null, videoMeta: null,
  fileA: null,
  fileB: null,
  mode: 'divider',
  dividerPosition: 50,
  syncPlayback: true,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const CompareActions = {
  loadFile: createAction('[Compare] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Compare] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Compare] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Compare] Update Config', props<{ config: Partial<CompareState> }>()),
  startProcessing: createAction('[Compare] Start'),
  updateProgress: createAction('[Compare] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Compare] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Compare] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Compare] Download'),
  resetState: createAction('[Compare] Reset') };
export const compareFeature = createFeature({
  name: 'compare',
  reducer: createReducer(init,
    on(CompareActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(CompareActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(CompareActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(CompareActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(CompareActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(CompareActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(CompareActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(CompareActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(CompareActions.resetState, () => init),
  )
});
export const { selectCompareState, selectStatus, selectProgress, selectOutputBlob } = compareFeature;
export const selectCompareCanProcess = createSelector(selectCompareState, s => !!s.inputFile && s.status === 'idle');
export const selectCompareIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
