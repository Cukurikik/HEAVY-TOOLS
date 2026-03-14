import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ConverterState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  targetFormat: 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'gif';
  codec: string;
  qualityPreset: 'fast' | 'balanced' | 'best';
  estimatedSizeMB: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ConverterState = {
  inputFile: null, videoMeta: null,
  targetFormat: 'mp4',
  codec: 'libx264',
  qualityPreset: 'balanced',
  estimatedSizeMB: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ConverterActions = {
  loadFile: createAction('[Converter] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Converter] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Converter] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Converter] Update Config', props<{ config: Partial<ConverterState> }>()),
  startProcessing: createAction('[Converter] Start'),
  updateProgress: createAction('[Converter] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Converter] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Converter] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Converter] Download'),
  resetState: createAction('[Converter] Reset') };
export const converterFeature = createFeature({
  name: 'converter',
  reducer: createReducer(init,
    on(ConverterActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ConverterActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(ConverterActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ConverterActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(ConverterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(ConverterActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ConverterActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ConverterActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(ConverterActions.resetState, () => init),
  )
});
export const { selectConverterState, selectStatus, selectProgress, selectOutputBlob } = converterFeature;
export const selectConverterCanProcess = createSelector(selectConverterState, s => !!s.inputFile && s.status === 'idle');
export const selectConverterIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
