// ============================================================
// Visualizer Type Definitions — visualizer.types.ts
// All TypeScript interfaces for the Visualizer module
// ============================================================

export type ElementType = 'Image' | 'Bars' | 'Particles' | 'MotionBlurEffect' | 'RadialSpectrum'
export type MeasureWhat = 'Nothing' | 'Beat' | 'TotalTime' | 'TotalTimeAndBeat'

export interface LyricLine {
  time: number
  text: string
}

// ---- Audio Analysis ----

export interface AudioAnalysisResult {
  frequencyData: Uint8Array
  timeDomainData: Uint8Array
  bassEnergy: number
  midEnergy: number
  highEnergy: number
  spectralFlux: number
  isBeat: boolean
  bpm: number | null
}

export interface AudioData {
  frequencyData: Uint8Array
  timeDomainData: Uint8Array
  isBeat: boolean
}

// ---- Particle ----

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  colorIdx: number
  size: number
}

// ---- Element Hierarchy ----

export interface BaseElement {
  id: string
  objType: ElementType
  name: string
  visible: boolean
  blendMode: 'Alpha' | 'Screen' | 'Add' | 'Multiply'

  // Transform (Avee Player relative coordinate system 0.0 to 1.0)
  position: { x: number; y: number }
  scale: { x: number; y: number }
  rotation: number

  // Beat Reactivity Modifiers
  measureScale: { measureWhat: MeasureWhat; amountX: number; amountY: number }
}

export interface ImageElement extends BaseElement {
  objType: 'Image'
  imageUrl: string
  color: string
  opacity: number
}

export interface BarsElement extends BaseElement {
  objType: 'Bars'
  color: string
  barCount: number
  barWidth: number
  roundness: number
}

export interface ParticlesElement extends BaseElement {
  objType: 'Particles'
  color: string
  speedMultiplier: number
  particleCount: number
  beatExplosion: number
}

export interface MotionBlurEffectElement extends BaseElement {
  objType: 'MotionBlurEffect'
  blurAmount: number
  rgbSplitAmount: number
}

export interface RadialSpectrumElement extends BaseElement {
  objType: 'RadialSpectrum'
  color: string
  radius: number
  barCount: number
  barWidth?: number
  roundness?: number
  rotationSpeed: number
  spectrumType?: 'Bars' | 'Line'
}

export type VisualizerElement =
  | ImageElement
  | BarsElement
  | ParticlesElement
  | MotionBlurEffectElement
  | RadialSpectrumElement

// ---- Video Encoder Worker Messages ----

export interface VideoEncoderConfig {
  width: number
  height: number
  frameRate: number
  bitrate: number
}

export type VideoWorkerMessage =
  | { type: 'INIT'; config: VideoEncoderConfig }
  | { type: 'FRAME'; imageData: ImageData; timestamp: number }
  | { type: 'FINISH' }

export type VideoWorkerResponse =
  | { type: 'READY' }
  | { type: 'PROGRESS'; percent: number }
  | { type: 'DONE'; blob: Blob }
  | { type: 'ERROR'; error: string }

// ---- Audio Analyzer Worker Messages ----

export type AudioWorkerMessage =
  | { type: 'INIT'; sampleRate: number; fftSize: number }
  | { type: 'ANALYZE'; buffer: Float32Array }

export type AudioWorkerResponse =
  | { type: 'RESULT'; data: AudioAnalysisResult }
  | { type: 'ERROR'; error: string }

// ---- GLSL Shader Exports ----

export interface ShaderSource {
  vertex: string
  fragment: string
}
