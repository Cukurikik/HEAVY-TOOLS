// ============================================================
// FEATURE 21 — ARCHIVE CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface ArchiveConverterState {
  inputFile: File | null;
  inputText: string;
  outputFormat: string;
  outputBlob: Blob | null;
  outputText: string;
  status: ProcessingStatus;
  progress: number;
  outputSizeMB: number | null;
  errorCode: ConverterErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: ArchiveConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'zip',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false,
};

export const ArchiveConverterActions = createActionGroup({
  source: 'Archive Converter',
  events: {
    'Load File': props<{ file: File }>(),
    'Set Input Text': props<{ text: string }>(),
    'Set Output Format': props<{ format: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob: Blob | null; outputText: string; outputSizeMB: number }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Copy To Clipboard': emptyProps(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps(),
  },
});

export const archiveConverterFeature = createFeature({
  name: 'archiveConverter',
  reducer: createReducer(
    initialState,
    on(ArchiveConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null,
    })),
    on(ArchiveConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(ArchiveConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(ArchiveConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null,
    })),
    on(ArchiveConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(ArchiveConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB,
    })),
    on(ArchiveConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable,
    })),
    on(ArchiveConverterActions.resetState, () => initialState),
  ),
});

export const {
  selectArchiveConverterState: selectArchiveConverterState,
  selectInputFile: selectArchiveConverterInputFile,
  selectOutputFormat: selectArchiveConverterOutputFormat,
  selectStatus: selectArchiveConverterStatus,
  selectProgress: selectArchiveConverterProgress,
  selectOutputBlob: selectArchiveConverterOutputBlob,
  selectOutputSizeMB: selectArchiveConverterOutputSizeMB,
  selectErrorMessage: selectArchiveConverterErrorMessage,
} = archiveConverterFeature;
