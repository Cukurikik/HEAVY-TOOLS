export interface ColorPalette {
  id: string
  name: string
  colors: string[]
  bg: string
  getColor: (intensity: number, index: number, total: number) => string
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function interpolateColors(colors: string[], t: number): string {
  if (colors.length === 0) return '#ffffff'
  if (colors.length === 1) return colors[0]
  const scaled = t * (colors.length - 1)
  const idx = Math.floor(scaled)
  const frac = scaled - idx
  const c1 = hexToRgb(colors[Math.min(idx, colors.length - 1)])
  const c2 = hexToRgb(colors[Math.min(idx + 1, colors.length - 1)])
  const r = Math.round(lerp(c1[0], c2[0], frac))
  const g = Math.round(lerp(c1[1], c2[1], frac))
  const b = Math.round(lerp(c1[2], c2[2], frac))
  return `rgb(${r},${g},${b})`
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'neon',
    name: 'Neon Matrix',
    bg: '#000000',
    colors: ['#00ff88', '#00cfff', '#8855ff', '#ff55cc'],
    getColor: (intensity, index, total) => {
      const t = index / total
      return interpolateColors(['#00ff88', '#00cfff', '#8855ff', '#ff55cc'], t)
    },
  },
  {
    id: 'fire',
    name: 'Inferno',
    bg: '#0a0000',
    colors: ['#ff0000', '#ff6600', '#ffcc00', '#ffffff'],
    getColor: (intensity, index, total) => {
      return interpolateColors(['#ff0000', '#ff6600', '#ffcc00', '#ffffff'], intensity)
    },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    bg: '#000a14',
    colors: ['#001f5b', '#0066cc', '#00cfff', '#88ffee'],
    getColor: (intensity, index, total) => {
      const t = (index / total) * 0.5 + intensity * 0.5
      return interpolateColors(['#001f5b', '#0066cc', '#00cfff', '#88ffee'], t)
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    bg: '#000510',
    colors: ['#00ff88', '#00ccff', '#aa00ff', '#ff0088', '#ffcc00'],
    getColor: (intensity, index, total) => {
      const t = index / total
      return interpolateColors(['#00ff88', '#00ccff', '#aa00ff', '#ff0088'], t)
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    bg: '#0a0010',
    colors: ['#ff0080', '#8800ff', '#0080ff', '#00ffff'],
    getColor: (intensity, index, total) => {
      const t = index / total
      return interpolateColors(['#ff0080', '#8800ff', '#0080ff', '#00ffff'], t)
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    bg: '#000000',
    colors: ['#333333', '#666666', '#999999', '#ffffff'],
    getColor: (intensity, index, total) => {
      const v = Math.round(intensity * 255)
      return `rgb(${v},${v},${v})`
    },
  },
  {
    id: 'toxic',
    name: 'Toxic',
    bg: '#000a00',
    colors: ['#003300', '#00ff00', '#aaff00', '#ffff00'],
    getColor: (intensity, index, total) => {
      return interpolateColors(['#003300', '#00ff00', '#aaff00', '#ffff00'], intensity)
    },
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    bg: '#05000f',
    colors: ['#1a0040', '#6600cc', '#cc00ff', '#ff88ff', '#ffffff'],
    getColor: (intensity, index, total) => {
      const t = (index / total + intensity) / 2
      return interpolateColors(['#1a0040', '#6600cc', '#cc00ff', '#ff88ff', '#ffffff'], Math.min(t, 1))
    },
  },
]
