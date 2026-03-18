// ============================================================
// FEATURE 24 — SPREADSHEET CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface SpreadsheetConverterState {
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

const initialState: SpreadsheetConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'xlsx',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const SpreadsheetConverterActions = createActionGroup({
  source: 'Spreadsheet Converter',
  events: {
    'Load File': props<{ file: File }>(),
    'Set Input Text': props<{ text: string }>(),
    'Set Output Format': props<{ format: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob?: Blob | null; outputText?: string; outputSizeMB?: number | null }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Copy To Clipboard': emptyProps(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps() } });

export const spreadsheetConverterFeature = createFeature({
  name: 'spreadsheetConverter',
  reducer: createReducer(
    initialState,
    on(SpreadsheetConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(SpreadsheetConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(SpreadsheetConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(SpreadsheetConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(SpreadsheetConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(SpreadsheetConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(SpreadsheetConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(SpreadsheetConverterActions.resetState, () => initialState),
  ) });

export const {
  selectSpreadsheetConverterState: selectSpreadsheetConverterState,
  selectInputFile: selectSpreadsheetConverterInputFile,
  selectOutputFormat: selectSpreadsheetConverterOutputFormat,
  selectStatus: selectSpreadsheetConverterStatus,
  selectProgress: selectSpreadsheetConverterProgress,
  selectOutputBlob: selectSpreadsheetConverterOutputBlob,
  selectOutputSizeMB: selectSpreadsheetConverterOutputSizeMB,
  selectErrorMessage: selectSpreadsheetConverterErrorMessage } = spreadsheetConverterFeature;
