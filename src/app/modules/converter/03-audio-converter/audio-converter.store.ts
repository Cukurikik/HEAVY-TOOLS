// ============================================================
// FEATURE 03 — AUDIO FORMAT CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface AudioConverterState {
  bitrate: string;
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

const initialState: AudioConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'mp3',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const AudioConverterActions = createActionGroup({
  source: 'Audio Format Converter',
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

export const audioConverterFeature = createFeature({
  name: 'audioConverter',
  reducer: createReducer(
    initialState,
    on(AudioConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(AudioConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(AudioConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(AudioConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(AudioConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(AudioConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(AudioConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(AudioConverterActions.resetState, () => initialState),
  ) });

export const {
  selectAudioConverterState: selectAudioConverterState,
  selectInputFile: selectAudioConverterInputFile,
  selectOutputFormat: selectAudioConverterOutputFormat,
  selectStatus: selectAudioConverterStatus,
  selectProgress: selectAudioConverterProgress,
  selectOutputBlob: selectAudioConverterOutputBlob,
  selectOutputSizeMB: selectAudioConverterOutputSizeMB,
  selectErrorMessage: selectAudioConverterErrorMessage } = audioConverterFeature;
