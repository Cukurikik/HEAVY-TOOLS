// ============================================================
// FEATURE 30 — BATCH CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface BatchConverterState {
  concurrentTasks: number;
  inputFiles: File[];
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

const initialState: BatchConverterState = {
  concurrentTasks: 3,
  inputFiles: [],
  inputText: '',
  outputFormat: 'auto',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const BatchConverterActions = createActionGroup({
  source: 'Batch Converter',
  events: {
    'Load Files': props<{ files: File[] }>(),
    'Set Input Text': props<{ text: string }>(),
    'Set Output Format': props<{ format: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob?: Blob | null; outputText?: string; outputSizeMB?: number | null }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Copy To Clipboard': emptyProps(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps() } });

export const batchConverterFeature = createFeature({
  name: 'batchConverter',
  reducer: createReducer(
    initialState,
    on(BatchConverterActions.loadFiles, (state, { files }) => ({
      ...state, inputFiles: [...state.inputFiles, ...files], status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(BatchConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(BatchConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(BatchConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(BatchConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(BatchConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(BatchConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(BatchConverterActions.resetState, () => initialState),
  ) });

export const {
  selectBatchConverterState: selectBatchConverterState,
  selectInputFiles: selectBatchConverterInputFiles,
  selectOutputFormat: selectBatchConverterOutputFormat,
  selectStatus: selectBatchConverterStatus,
  selectProgress: selectBatchConverterProgress,
  selectOutputBlob: selectBatchConverterOutputBlob,
  selectOutputSizeMB: selectBatchConverterOutputSizeMB,
  selectErrorMessage: selectBatchConverterErrorMessage } = batchConverterFeature;
