// ============================================================
// FEATURE 12 — HTML CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface HtmlConverterState {
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

const initialState: HtmlConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'pdf',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false,
};

export const HtmlConverterActions = createActionGroup({
  source: 'HTML Converter',
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

export const htmlConverterFeature = createFeature({
  name: 'htmlConverter',
  reducer: createReducer(
    initialState,
    on(HtmlConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null,
    })),
    on(HtmlConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(HtmlConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(HtmlConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null,
    })),
    on(HtmlConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(HtmlConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB,
    })),
    on(HtmlConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable,
    })),
    on(HtmlConverterActions.resetState, () => initialState),
  ),
});

export const {
  selectHtmlConverterState: selectHtmlConverterState,
  selectInputFile: selectHtmlConverterInputFile,
  selectOutputFormat: selectHtmlConverterOutputFormat,
  selectStatus: selectHtmlConverterStatus,
  selectProgress: selectHtmlConverterProgress,
  selectOutputBlob: selectHtmlConverterOutputBlob,
  selectOutputSizeMB: selectHtmlConverterOutputSizeMB,
  selectErrorMessage: selectHtmlConverterErrorMessage,
} = htmlConverterFeature;
