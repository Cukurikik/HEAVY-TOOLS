import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface CompressorState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mode: 'targetSize' | 'crf';
  targetSizeMB: number;
  crfValue: number;
  originalSizeMB: number;
  estimatedOutputMB: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: CompressorState = {
  inputFile: null, videoMeta: null,
  mode: 'crf',
  targetSizeMB: 50,
  crfValue: 23,
  originalSizeMB: 0,
  estimatedOutputMB: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const CompressorActions = {
  loadFile: createAction('[Compressor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Compressor] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Compressor] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Compressor] Update Config', props<{ config: Partial<CompressorState> }>()),
  startProcessing: createAction('[Compressor] Start'),
  updateProgress: createAction('[Compressor] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Compressor] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Compressor] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Compressor] Download'),
  resetState: createAction('[Compressor] Reset') };
export const compressorFeature = createFeature({
  name: 'compressor',
  reducer: createReducer(init,
    on(CompressorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(CompressorActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(CompressorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(CompressorActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(CompressorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(CompressorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(CompressorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(CompressorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(CompressorActions.resetState, () => init),
  )
});
export const { selectCompressorState, selectStatus, selectProgress, selectOutputBlob } = compressorFeature;
export const selectCompressorCanProcess = createSelector(selectCompressorState, s => !!s.inputFile && s.status === 'idle');
export const selectCompressorIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
