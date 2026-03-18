// ============================================================
// FEATURE 11 — MARKDOWN CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface MarkdownConverterState {
  flavor: string;
  sanitize: boolean;
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

const initialState: MarkdownConverterState = {
  flavor: 'gfm',
  sanitize: true,
  inputFile: null,
  inputText: '',
  outputFormat: 'html',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const MarkdownConverterActions = createActionGroup({
  source: 'Markdown Converter',
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

export const markdownConverterFeature = createFeature({
  name: 'markdownConverter',
  reducer: createReducer(
    initialState,
    on(MarkdownConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(MarkdownConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(MarkdownConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(MarkdownConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(MarkdownConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(MarkdownConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(MarkdownConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(MarkdownConverterActions.resetState, () => initialState),
  ) });

export const {
  selectMarkdownConverterState: selectMarkdownConverterState,
  selectInputFile: selectMarkdownConverterInputFile,
  selectOutputFormat: selectMarkdownConverterOutputFormat,
  selectStatus: selectMarkdownConverterStatus,
  selectProgress: selectMarkdownConverterProgress,
  selectOutputBlob: selectMarkdownConverterOutputBlob,
  selectOutputSizeMB: selectMarkdownConverterOutputSizeMB,
  selectErrorMessage: selectMarkdownConverterErrorMessage } = markdownConverterFeature;
