// ============================================================
// FEATURE 20 — EBOOK CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface EbookConverterState {
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

const initialState: EbookConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'epub',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false,
};

export const EbookConverterActions = createActionGroup({
  source: 'Ebook Converter',
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

export const ebookConverterFeature = createFeature({
  name: 'ebookConverter',
  reducer: createReducer(
    initialState,
    on(EbookConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null,
    })),
    on(EbookConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(EbookConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(EbookConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null,
    })),
    on(EbookConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(EbookConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB,
    })),
    on(EbookConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable,
    })),
    on(EbookConverterActions.resetState, () => initialState),
  ),
});

export const {
  selectEbookConverterState: selectEbookConverterState,
  selectInputFile: selectEbookConverterInputFile,
  selectOutputFormat: selectEbookConverterOutputFormat,
  selectStatus: selectEbookConverterStatus,
  selectProgress: selectEbookConverterProgress,
  selectOutputBlob: selectEbookConverterOutputBlob,
  selectOutputSizeMB: selectEbookConverterOutputSizeMB,
  selectErrorMessage: selectEbookConverterErrorMessage,
} = ebookConverterFeature;
