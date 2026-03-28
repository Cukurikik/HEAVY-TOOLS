/**
 * Omni-Tool Native Engine — TypeScript Type Declarations
 * 
 * These types describe the C++ WASM modules exposed via Emscripten Embind.
 * Used by `NativeEngine.load()` to provide typed function handles.
 */

// ═══════════════════════════════════════════════════
// Image Kernel Module
// ═══════════════════════════════════════════════════
export interface OmniImageKernel {
  resize(pixels: Uint8Array, width: number, height: number, newWidth: number, newHeight: number): Uint8Array;
  sharpen(pixels: Uint8Array, width: number, height: number, strength: number): Uint8Array;
  denoise(pixels: Uint8Array, width: number, height: number, strength: number): Uint8Array;
  grayscale(pixels: Uint8Array, width: number, height: number): Uint8Array;
  adjustBrightnessContrast(pixels: Uint8Array, width: number, height: number, brightness: number, contrast: number): Uint8Array;
  gaussianBlur(pixels: Uint8Array, width: number, height: number, radius: number): Uint8Array;
  sepia(pixels: Uint8Array, width: number, height: number): Uint8Array;
  invert(pixels: Uint8Array, width: number, height: number): Uint8Array;
}

// ═══════════════════════════════════════════════════
// Audio DSP Module
// ═══════════════════════════════════════════════════
export interface OmniAudioDsp {
  equalize(samples: Float32Array, numSamples: number, sampleRate: number, lowGain: number, midGain: number, highGain: number): Float32Array;
  compress(samples: Float32Array, numSamples: number, sampleRate: number, threshold: number, ratio: number, attack: number, release: number): Float32Array;
  limit(samples: Float32Array, numSamples: number, sampleRate: number, ceiling: number): Float32Array;
  normalize(samples: Float32Array, numSamples: number, targetDb: number): Float32Array;
  pitchShift(samples: Float32Array, numSamples: number, sampleRate: number, semitones: number): Float32Array;
}

// ═══════════════════════════════════════════════════
// Crypto Engine Module
// ═══════════════════════════════════════════════════
export interface EncryptedPayload {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  tag: Uint8Array;
}

export interface OmniCryptoEngine {
  sha256(data: Uint8Array, length: number): Uint8Array;
  randomBytes(length: number): Uint8Array;
  encrypt(plaintext: Uint8Array, length: number, key: Uint8Array): EncryptedPayload;
  decrypt(ciphertext: Uint8Array, iv: Uint8Array, tag: Uint8Array, key: Uint8Array): Uint8Array | null;
}

// ═══════════════════════════════════════════════════
// Module Registry Map
// ═══════════════════════════════════════════════════
export interface NativeModuleMap {
  'image-kernel': OmniImageKernel;
  'audio-dsp': OmniAudioDsp;
  'crypto-engine': OmniCryptoEngine;
}

export type NativeModuleName = keyof NativeModuleMap;
