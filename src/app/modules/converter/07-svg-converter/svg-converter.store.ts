// ============================================================
// FEATURE 07 — SVG CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface SvgConverterState {
  scale: number;
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

const initialState: SvgConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'png',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const SvgConverterActions = createActionGroup({
  source: 'SVG Converter',
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

export const svgConverterFeature = createFeature({
  name: 'svgConverter',
  reducer: createReducer(
    initialState,
    on(SvgConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(SvgConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(SvgConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(SvgConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(SvgConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(SvgConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(SvgConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(SvgConverterActions.resetState, () => initialState),
  ) });

export const {
  selectSvgConverterState: selectSvgConverterState,
  selectInputFile: selectSvgConverterInputFile,
  selectOutputFormat: selectSvgConverterOutputFormat,
  selectStatus: selectSvgConverterStatus,
  selectProgress: selectSvgConverterProgress,
  selectOutputBlob: selectSvgConverterOutputBlob,
  selectOutputSizeMB: selectSvgConverterOutputSizeMB,
  selectErrorMessage: selectSvgConverterErrorMessage } = svgConverterFeature;
