// ============================================================
// DEPRECATED — Re-exports from the new standalone visualizer module
// This file exists for backward compatibility only.
// Import from '@/modules/visualizer/store/useVisualizerStore' directly.
// ============================================================

export {
  useVisualizerStore,
} from '@/modules/visualizer/store/useVisualizerStore'

export type {
  ElementType,
  VisualizerElement,
  LyricLine,
  ImageElement,
  BarsElement,
  ParticlesElement,
  MotionBlurEffectElement,
  RadialSpectrumElement,
  BaseElement,
  MeasureWhat,
} from '@/modules/visualizer/types/visualizer.types'
