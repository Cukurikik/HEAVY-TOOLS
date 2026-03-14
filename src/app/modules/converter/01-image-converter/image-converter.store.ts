// ============================================================
// FEATURE 01 — IMAGE CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface ImageConverterState {
  inputFiles: File[];
  outputFormat: string;
  quality: number;
  colorSpace: string;
  preserveExif: boolean;
  lossless: boolean;
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: ConverterErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: ImageConverterState = {
  inputFiles: [],
  outputFormat: 'jpeg',
  quality: 85,
  colorSpace: 'srgb',
  preserveExif: true,
  lossless: false,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const ImageConverterActions = createActionGroup({
  source: 'Image Converter',
  events: {
    'Load Files': props<{ files: File[] }>(),
    'Set Output Format': props<{ format: string }>(),
    'Set Quality': props<{ quality: number }>(),
    'Set Color Space': props<{ colorSpace: string }>(),
    'Toggle Preserve Exif': emptyProps(),
    'Toggle Lossless': emptyProps(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob: Blob; outputSizeMB: number }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps() } });

export const imageConverterFeature = createFeature({
  name: 'imageConverter',
  reducer: createReducer(
    initialState,
    on(ImageConverterActions.loadFiles, (state, { files }) => ({
      ...state, inputFiles: files, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(ImageConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(ImageConverterActions.setQuality, (state, { quality }) => ({ ...state, quality })),
    on(ImageConverterActions.setColorSpace, (state, { colorSpace }) => ({ ...state, colorSpace })),
    on(ImageConverterActions.togglePreserveExif, (state) => ({ ...state, preserveExif: !state.preserveExif })),
    on(ImageConverterActions.toggleLossless, (state) => ({ ...state, lossless: !state.lossless })),
    on(ImageConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(ImageConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(ImageConverterActions.processingSuccess, (state, { outputBlob, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputSizeMB })),
    on(ImageConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(ImageConverterActions.resetState, () => initialState),
  ) });

export const {
  selectImageConverterState,
  selectInputFiles,
  selectOutputFormat,
  selectQuality,
  selectStatus,
  selectProgress,
  selectOutputBlob,
  selectOutputSizeMB,
  selectErrorCode,
  selectErrorMessage,
  selectRetryable } = imageConverterFeature;
