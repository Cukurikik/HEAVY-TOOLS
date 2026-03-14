// ============================================================
// FEATURE 16 — TIMEZONE CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface TimezoneConverterState {
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

const initialState: TimezoneConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'UTC',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const TimezoneConverterActions = createActionGroup({
  source: 'Timezone Converter',
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

export const timezoneConverterFeature = createFeature({
  name: 'timezoneConverter',
  reducer: createReducer(
    initialState,
    on(TimezoneConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(TimezoneConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(TimezoneConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(TimezoneConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(TimezoneConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(TimezoneConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB })),
    on(TimezoneConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(TimezoneConverterActions.resetState, () => initialState),
  ) });

export const {
  selectTimezoneConverterState: selectTimezoneConverterState,
  selectInputFile: selectTimezoneConverterInputFile,
  selectOutputFormat: selectTimezoneConverterOutputFormat,
  selectStatus: selectTimezoneConverterStatus,
  selectProgress: selectTimezoneConverterProgress,
  selectOutputBlob: selectTimezoneConverterOutputBlob,
  selectOutputSizeMB: selectTimezoneConverterOutputSizeMB,
  selectErrorMessage: selectTimezoneConverterErrorMessage } = timezoneConverterFeature;
