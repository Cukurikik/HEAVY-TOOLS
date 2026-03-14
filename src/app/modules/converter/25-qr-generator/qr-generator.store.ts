// ============================================================
// FEATURE 25 — QR CODE GENERATOR — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface QrGeneratorState {
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

const initialState: QrGeneratorState = {
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
  retryable: false,
};

export const QrGeneratorActions = createActionGroup({
  source: 'QR Code Generator',
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
    'Reset State': emptyProps(),
  },
});

export const qrGeneratorFeature = createFeature({
  name: 'qrGenerator',
  reducer: createReducer(
    initialState,
    on(QrGeneratorActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null,
    })),
    on(QrGeneratorActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(QrGeneratorActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(QrGeneratorActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null,
    })),
    on(QrGeneratorActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(QrGeneratorActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB,
    })),
    on(QrGeneratorActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable,
    })),
    on(QrGeneratorActions.resetState, () => initialState),
  ),
});

export const {
  selectQrGeneratorState: selectQrGeneratorState,
  selectInputFile: selectQrGeneratorInputFile,
  selectOutputFormat: selectQrGeneratorOutputFormat,
  selectStatus: selectQrGeneratorStatus,
  selectProgress: selectQrGeneratorProgress,
  selectOutputBlob: selectQrGeneratorOutputBlob,
  selectOutputSizeMB: selectQrGeneratorOutputSizeMB,
  selectErrorMessage: selectQrGeneratorErrorMessage,
} = qrGeneratorFeature;
