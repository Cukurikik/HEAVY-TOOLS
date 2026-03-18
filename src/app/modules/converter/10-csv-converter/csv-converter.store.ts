// ============================================================
// FEATURE 10 — CSV CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface CsvConverterState {
  delimiter: string;
  hasHeaders: boolean;
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

const initialState: CsvConverterState = {
  delimiter: ',',
  hasHeaders: true,
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

export const CsvConverterActions = createActionGroup({
  source: 'CSV Converter',
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

export const csvConverterFeature = createFeature({
  name: 'csvConverter',
  reducer: createReducer(
    initialState,
    on(CsvConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(CsvConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(CsvConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(CsvConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(CsvConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(CsvConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(CsvConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(CsvConverterActions.resetState, () => initialState),
  ) });

export const {
  selectCsvConverterState: selectCsvConverterState,
  selectInputFile: selectCsvConverterInputFile,
  selectOutputFormat: selectCsvConverterOutputFormat,
  selectStatus: selectCsvConverterStatus,
  selectProgress: selectCsvConverterProgress,
  selectOutputBlob: selectCsvConverterOutputBlob,
  selectOutputSizeMB: selectCsvConverterOutputSizeMB,
  selectErrorMessage: selectCsvConverterErrorMessage } = csvConverterFeature;
