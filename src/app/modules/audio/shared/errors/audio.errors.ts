import type { AudioErrorCode } from '../types/audio.types';

export const AudioErrorMessages: Record<AudioErrorCode, string> = {
  FILE_TOO_LARGE: 'File exceeds maximum size limit.',
  INVALID_FILE_TYPE: 'Please upload a valid audio file.',
  FILE_CORRUPTED: 'The audio file appears to be corrupted.',
  AUDIO_CONTEXT_FAILED: 'Failed to initialize Web Audio API.',
  DECODE_FAILED: 'Unable to decode audio file.',
  ENCODE_FAILED: 'Audio encoding failed.',
  FFMPEG_LOAD_FAILED: 'FFmpeg WASM engine could not be loaded.',
  FFMPEG_TIMEOUT: 'Processing timed out.',
  WORKER_CRASHED: 'Audio processing worker crashed unexpectedly.',
  ONNX_LOAD_FAILED: 'AI model runtime failed to load.',
  MODEL_DOWNLOAD_FAILED: 'AI model download failed.',
  INSUFFICIENT_MEMORY: 'Not enough memory for this operation.',
  MIC_PERMISSION_DENIED: 'Microphone access was denied.',
  NO_AUDIO_STREAM: 'No audio stream found in file.',
  INVALID_PARAMS: 'Invalid processing parameters.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};
