import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
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

// Re-export all types for backward compatibility
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
}

interface VisualizerState {
  elements: VisualizerElement[]
  activeElementId: string | null
  lyrics: LyricLine[] | null
  albumArt: string | null
  
  // Actions
  addElement: (type: ElementType) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<VisualizerElement>) => void
  reorderElements: (startIndex: number, endIndex: number) => void
  setActiveElement: (id: string | null) => void
  setLyrics: (lyrics: LyricLine[] | null) => void
  setAlbumArt: (url: string | null) => void
  loadScene: (elements: VisualizerElement[]) => void
  resetScene: () => void
}

const getDefaultElement = (type: ElementType): VisualizerElement => {
  const base: BaseElement = {
    id: crypto.randomUUID(),
    objType: type,
    name: `New ${type}`,
    visible: true,
    blendMode: 'Alpha',
    position: { x: 0.5, y: 0.5 },
    scale: { x: 1.0, y: 1.0 },
    rotation: 0,
    measureScale: { measureWhat: 'Beat', amountX: 0.15, amountY: 0.15 },
  }

  switch (type) {
    case 'Image':
      return { ...base, objType: 'Image', imageUrl: 'internalres:circle', color: '#ffffff', opacity: 1.0 }
    case 'Bars':
      return { ...base, objType: 'Bars', color: '#00ffff', barCount: 64, barWidth: 8, roundness: 4 }
    case 'Particles':
      return { ...base, objType: 'Particles', color: '#ff00ff', speedMultiplier: 1.0, particleCount: 200, beatExplosion: 1.0, blendMode: 'Screen' }
    case 'MotionBlurEffect':
      return { ...base, objType: 'MotionBlurEffect', blurAmount: 0.15, rgbSplitAmount: 0.05, name: 'Motion Blur / RGB Split', blendMode: 'Screen' }
    case 'RadialSpectrum':
      return { ...base, objType: 'RadialSpectrum', color: '#00ff88', radius: 150, barCount: 128, barWidth: 20, roundness: 8, rotationSpeed: 0, spectrumType: 'Line' }
  }
}

// Initial default scene mimicking Avee Player's typical setup
const DEFAULT_SCENE: VisualizerElement[] = [
  getDefaultElement('Particles'),
  getDefaultElement('RadialSpectrum'),
  getDefaultElement('MotionBlurEffect')
]
DEFAULT_SCENE[0].name = 'Background Particles'
DEFAULT_SCENE[1].name = 'Main Spectrum'
DEFAULT_SCENE[2].name = 'Beat Post-Processing'

export const useVisualizerStore = create<VisualizerState>()(
  persist(
    immer((set) => ({
      elements: DEFAULT_SCENE,
      activeElementId: null,
      lyrics: null,
      albumArt: null,

      addElement: (type) => set((state) => {
        state.elements.push(getDefaultElement(type))
      }),

      removeElement: (id) => set((state) => {
        state.elements = state.elements.filter((el: VisualizerElement) => el.id !== id)
        if (state.activeElementId === id) {
          state.activeElementId = null
        }
      }),

      updateElement: (id, updates) => set((state) => {
        const el = state.elements.find((e: VisualizerElement) => e.id === id)
        if (el) {
          Object.assign(el, updates)
        }
      }),

      reorderElements: (startIndex, endIndex) => set((state) => {
        const [removed] = state.elements.splice(startIndex, 1)
        state.elements.splice(endIndex, 0, removed)
      }),

      setActiveElement: (id) => set((state) => {
        state.activeElementId = id
      }),

      loadScene: (elements) => set((state) => {
        state.elements = elements
        state.activeElementId = null
      }),

      setLyrics: (lyrics) => set((state) => {
        state.lyrics = lyrics
      }),

      setAlbumArt: (url) => set((state) => {
        state.albumArt = url
      }),

      resetScene: () => set((state) => {
        state.elements = DEFAULT_SCENE
        state.activeElementId = null
      })
    })),
    {
      name: 'avee-visualizer-store',
      partialize: (state) => ({ elements: state.elements }) // Only persist the layers
    }
  )
)
