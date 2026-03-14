import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface MergerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  clips: { id: string; file: File; duration: number }[];
  encodeMode: 'copy' | 'reencode';
  outputFormat: 'mp4' | 'webm';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: MergerState = {
  inputFile: null, videoMeta: null,
  clips: [],
  encodeMode: 'copy',
  outputFormat: 'mp4',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const MergerActions = {
  loadFile: createAction('[Merger] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Merger] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Merger] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Merger] Update Config', props<{ config: Partial<MergerState> }>()),
  startProcessing: createAction('[Merger] Start'),
  updateProgress: createAction('[Merger] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Merger] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Merger] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Merger] Download'),
  resetState: createAction('[Merger] Reset') };
export const mergerFeature = createFeature({
  name: 'merger',
  reducer: createReducer(init,
    on(MergerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(MergerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(MergerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(MergerActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(MergerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(MergerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(MergerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(MergerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(MergerActions.resetState, () => init),
  )
});
export const { selectMergerState, selectStatus, selectProgress, selectOutputBlob } = mergerFeature;
export const selectMergerCanProcess = createSelector(selectMergerState, s => !!s.inputFile && s.status === 'idle');
export const selectMergerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
