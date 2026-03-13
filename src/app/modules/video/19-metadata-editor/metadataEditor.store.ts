import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface MetadataEditorState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  rawMetadata: Record<string, string>;
  editedFields: { title: string; artist: string; album: string; year: string; description: string; comment: string };
  coverArt: File | null;
  stripAll: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: MetadataEditorState = {
  inputFile: null, videoMeta: null,
  rawMetadata: {},
  editedFields: { title: '', artist: '', album: '', year: '', description: '', comment: '' },
  coverArt: null,
  stripAll: false,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const MetadataEditorActions = {
  loadFile: createAction('[MetadataEditor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[MetadataEditor] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[MetadataEditor] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[MetadataEditor] Update Config', props<{ config: Partial<MetadataEditorState> }>()),
  startProcessing: createAction('[MetadataEditor] Start'),
  updateProgress: createAction('[MetadataEditor] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[MetadataEditor] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[MetadataEditor] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[MetadataEditor] Download'),
  resetState: createAction('[MetadataEditor] Reset'),
};
export const metadataEditorFeature = createFeature({
  name: 'metadataEditor',
  reducer: createReducer(init,
    on(MetadataEditorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(MetadataEditorActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(MetadataEditorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(MetadataEditorActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(MetadataEditorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(MetadataEditorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(MetadataEditorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(MetadataEditorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(MetadataEditorActions.resetState, () => init),
  )
});
export const { selectMetadataEditorState, selectStatus, selectProgress, selectOutputBlob } = metadataEditorFeature;
export const selectMetadataEditorCanProcess = createSelector(selectMetadataEditorState, s => !!s.inputFile && s.status === 'idle');
export const selectMetadataEditorIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
