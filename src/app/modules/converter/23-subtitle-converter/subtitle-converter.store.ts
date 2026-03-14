// ============================================================
// FEATURE 23 — SUBTITLE CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface SubtitleConverterState {
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

const initialState: SubtitleConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'srt',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const SubtitleConverterActions = createActionGroup({
  source: 'Subtitle Converter',
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

export const subtitleConverterFeature = createFeature({
  name: 'subtitleConverter',
  reducer: createReducer(
    initialState,
    on(SubtitleConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(SubtitleConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(SubtitleConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(SubtitleConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(SubtitleConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(SubtitleConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB })),
    on(SubtitleConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(SubtitleConverterActions.resetState, () => initialState),
  ) });

export const {
  selectSubtitleConverterState: selectSubtitleConverterState,
  selectInputFile: selectSubtitleConverterInputFile,
  selectOutputFormat: selectSubtitleConverterOutputFormat,
  selectStatus: selectSubtitleConverterStatus,
  selectProgress: selectSubtitleConverterProgress,
  selectOutputBlob: selectSubtitleConverterOutputBlob,
  selectOutputSizeMB: selectSubtitleConverterOutputSizeMB,
  selectErrorMessage: selectSubtitleConverterErrorMessage } = subtitleConverterFeature;
