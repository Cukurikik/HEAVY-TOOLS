// ============================================================
// FEATURE 09 — JSON CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface JsonConverterState {
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

const initialState: JsonConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'json',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const JsonConverterActions = createActionGroup({
  source: 'JSON Converter',
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
    'Reset State': emptyProps() } });

export const jsonConverterFeature = createFeature({
  name: 'jsonConverter',
  reducer: createReducer(
    initialState,
    on(JsonConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(JsonConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(JsonConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(JsonConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(JsonConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(JsonConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB })),
    on(JsonConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(JsonConverterActions.resetState, () => initialState),
  ) });

export const {
  selectJsonConverterState: selectJsonConverterState,
  selectInputFile: selectJsonConverterInputFile,
  selectOutputFormat: selectJsonConverterOutputFormat,
  selectStatus: selectJsonConverterStatus,
  selectProgress: selectJsonConverterProgress,
  selectOutputBlob: selectJsonConverterOutputBlob,
  selectOutputSizeMB: selectJsonConverterOutputSizeMB,
  selectErrorMessage: selectJsonConverterErrorMessage } = jsonConverterFeature;
