import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface WatermarkState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  watermarkFile: File | null;
  mode: 'image' | 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  position: 'TL' | 'TC' | 'TR' | 'ML' | 'MC' | 'MR' | 'BL' | 'BC' | 'BR';
  opacity: number;
  scale: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: WatermarkState = {
  inputFile: null, videoMeta: null,
  watermarkFile: null,
  mode: 'text',
  text: 'OMNI-TOOL',
  fontFamily: 'Arial',
  fontSize: 36,
  fontColor: '#FFFFFF',
  position: 'BR',
  opacity: 0.7,
  scale: 0.2,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const WatermarkActions = {
  loadFile: createAction('[Watermark] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Watermark] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Watermark] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Watermark] Update Config', props<{ config: Partial<WatermarkState> }>()),
  startProcessing: createAction('[Watermark] Start'),
  updateProgress: createAction('[Watermark] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Watermark] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Watermark] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Watermark] Download'),
  resetState: createAction('[Watermark] Reset') };
export const watermarkFeature = createFeature({
  name: 'watermark',
  reducer: createReducer(init,
    on(WatermarkActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(WatermarkActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(WatermarkActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(WatermarkActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(WatermarkActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(WatermarkActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(WatermarkActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(WatermarkActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(WatermarkActions.resetState, () => init),
  )
});
export const { selectWatermarkState, selectStatus, selectProgress, selectOutputBlob } = watermarkFeature;
export const selectWatermarkCanProcess = createSelector(selectWatermarkState, s => !!s.inputFile && s.status === 'idle');
export const selectWatermarkIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
