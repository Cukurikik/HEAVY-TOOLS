import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface VideoConverterState {
  inputFile: File | null;
  outputFormat: string;
  crf: number;
  encodingSpeed: string;
  resolution: string;
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: ConverterErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: VideoConverterState = {
  inputFile: null, outputFormat: 'mp4', crf: 23, encodingSpeed: 'medium', resolution: 'original',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false,
};

export const VideoConverterActions = createActionGroup({
  source: 'Video Converter',
  events: {
    'Load File': props<{ file: File }>(),
    'Set Output Format': props<{ format: string }>(),
    'Set CRF': props<{ crf: number }>(),
    'Set Encoding Speed': props<{ speed: string }>(),
    'Set Resolution': props<{ resolution: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob: Blob; outputSizeMB: number }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps(),
  },
});

export const videoConverterFeature = createFeature({
  name: 'videoConverter',
  reducer: createReducer(
    initialState,
    on(VideoConverterActions.loadFile, (state, { file }) => ({ ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(VideoConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(VideoConverterActions.setCRF, (state, { crf }) => ({ ...state, crf })),
    on(VideoConverterActions.setEncodingSpeed, (state, { speed }) => ({ ...state, encodingSpeed: speed })),
    on(VideoConverterActions.setResolution, (state, { resolution }) => ({ ...state, resolution })),
    on(VideoConverterActions.startProcessing, (state) => ({ ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(VideoConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(VideoConverterActions.processingSuccess, (state, { outputBlob, outputSizeMB }) => ({ ...state, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(VideoConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({ ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(VideoConverterActions.resetState, () => initialState),
  ),
});

export const { selectVideoConverterState, selectInputFile: selectVideoInputFile, selectOutputFormat: selectVideoOutputFormat, selectStatus: selectVideoStatus, selectProgress: selectVideoProgress, selectOutputBlob: selectVideoOutputBlob, selectOutputSizeMB: selectVideoOutputSizeMB, selectErrorMessage: selectVideoErrorMessage } = videoConverterFeature;
