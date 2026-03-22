import { VisualizerElement } from '../store/useVisualizerStore'

const BLUR_NODE: any = {
  id: 't-blur', objType: 'MotionBlurEffect', name: 'Motion Blur / RGB Split',
  visible: true, blendMode: 'Alpha', position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
  measureScale: { measureWhat: 'Nothing', amountX: 0, amountY: 0 },
  blurAmount: 0.5, rgbSplitAmount: 0.6
}

export const AVEE_TEMPLATES: { id: string, name: string, elements: VisualizerElement[] }[] = [
  {
    id: 'avee-legacy',
    name: 'Avee Legacy Overlay',
    elements: [
      BLUR_NODE,
      {
        id: 'al-part', objType: 'Particles', name: 'Background Energy', visible: true, blendMode: 'Screen',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.1, amountY: 0.1 },
        particleCount: 150, color: '#00cfff', speedMultiplier: 1.5, beatExplosion: 1.0
      },
      {
        id: 'al-rad', objType: 'RadialSpectrum', name: 'Audio React Circle', visible: true, blendMode: 'Alpha',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.2, amountY: 0.2 },
        color: '#ffffff', radius: 120, barCount: 60, rotationSpeed: 0, spectrumType: 'Bars'
      },
      {
        id: 'al-img', objType: 'Image', name: 'Center Logo', visible: true, blendMode: 'Alpha',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.25, amountY: 0.25 },
        imageUrl: 'internalres:circle', color: '#14b8a6', opacity: 1.0
      }
    ] as VisualizerElement[]
  },
  {
    id: 'trap-nation',
    name: 'Trap Nation Bass',
    elements: [
       BLUR_NODE,
       {
         id: 'tn-part', objType: 'Particles', name: 'Sparks', visible: true, blendMode: 'Add',
         position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
         measureScale: { measureWhat: 'Beat', amountX: 0.15, amountY: 0.15 },
         particleCount: 300, color: '#ffffff', speedMultiplier: 0.5, beatExplosion: 3.5
       },
       {
         id: 'tn-rad', objType: 'RadialSpectrum', name: 'Bass EQ', visible: true, blendMode: 'Alpha',
         position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
         measureScale: { measureWhat: 'Beat', amountX: 0.3, amountY: 0.3 },
         color: '#ffffff', radius: 100, barCount: 120, rotationSpeed: 0, spectrumType: 'Bars'
       },
       {
         id: 'tn-img', objType: 'Image', name: 'Logo React', visible: true, blendMode: 'Alpha',
         position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
         measureScale: { measureWhat: 'Beat', amountX: 0.4, amountY: 0.4 }, 
         imageUrl: 'internalres:circle', color: '#050505', opacity: 0.95
       }
    ] as VisualizerElement[]
  },
  {
    id: 'monstercat-style',
    name: 'Monstercat Line',
    elements: [
       BLUR_NODE,
       {
         id: 'mc-part', objType: 'Particles', name: 'Ambient Dust', visible: true, blendMode: 'Screen',
         position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
         measureScale: { measureWhat: 'Beat', amountX: 0.1, amountY: 0.1 },
         particleCount: 80, color: '#ffffff', speedMultiplier: 0.2, beatExplosion: 0.5
       },
       {
         id: 'm-bars', objType: 'Bars', name: 'EQ Spectrum', visible: true, blendMode: 'Alpha',
         position: { x: 0.5, y: 0.8 }, scale: { x: 1.6, y: 1.2 }, rotation: 0,
         measureScale: { measureWhat: 'Beat', amountX: 0.2, amountY: 0.3 },
         color: '#ffffff', barCount: 80, barWidth: 8, roundness: 4
       }
    ] as VisualizerElement[]
  },
  {
    id: 'cyberpunk-pulse',
    name: 'Cyberpunk Pulse',
    elements: [
      {
        id: 'cp-blur', objType: 'MotionBlurEffect', name: 'Extreme Trails',
        visible: true, blendMode: 'Alpha', position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Nothing', amountX: 0, amountY: 0 },
        blurAmount: 0.85, rgbSplitAmount: 1.2
      },
      {
        id: 'cp-rad', objType: 'RadialSpectrum', name: 'Neon Ring Core', visible: true, blendMode: 'Screen',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.4, amountY: 0.4 },
        color: '#ff00ff', radius: 50, barCount: 30, rotationSpeed: 0, spectrumType: 'Line'
      },
      {
        id: 'cp-rad2', objType: 'RadialSpectrum', name: 'Neon Ring Outer', visible: true, blendMode: 'Screen',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1.2, y: 1.2 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.25, amountY: 0.25 },
        color: '#00ffff', radius: 150, barCount: 160, rotationSpeed: 0, spectrumType: 'Line'
      }
    ] as VisualizerElement[]
  },
  {
    id: 'jedag-jedug',
    name: 'Jedag Jedug TikTok',
    elements: [
      {
        id: 'jj-blur', objType: 'MotionBlurEffect', name: 'Heavy Trail',
        visible: true, blendMode: 'Alpha', position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Nothing', amountX: 0, amountY: 0 },
        blurAmount: 0.7, rgbSplitAmount: 0.8
      },
      {
        id: 'jj-part', objType: 'Particles', name: 'Bass Sparks', visible: true, blendMode: 'Add',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.3, amountY: 0.3 },
        particleCount: 250, color: '#ff3366', speedMultiplier: 1.0, beatExplosion: 4.0
      },
      {
        id: 'jj-rad', objType: 'RadialSpectrum', name: 'Main Spectrum', visible: true, blendMode: 'Alpha',
        position: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.35, amountY: 0.35 },
        color: '#00ff88', radius: 80, barCount: 64, rotationSpeed: 0, spectrumType: 'Bars'
      },
      {
        id: 'jj-img', objType: 'Image', name: 'Reactive Center', visible: true, blendMode: 'Alpha',
        position: { x: 0.5, y: 0.5 }, scale: { x: 0.8, y: 0.8 }, rotation: 0,
        measureScale: { measureWhat: 'Beat', amountX: 0.5, amountY: 0.5 },
        imageUrl: 'internalres:circle', color: '#00ff88', opacity: 1.0
      }
    ] as VisualizerElement[]
  }
]
