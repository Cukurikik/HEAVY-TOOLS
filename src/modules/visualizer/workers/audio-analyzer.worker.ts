// ============================================================
// audio-analyzer.worker.ts — Web Worker for FFT Analysis
// Offloads beat detection & spectral flux from the main thread
// ============================================================

/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope

interface AnalyzerConfig {
  sampleRate: number
  fftSize: number
}

interface AnalysisResult {
  bassEnergy: number
  midEnergy: number
  highEnergy: number
  spectralFlux: number
  isBeat: boolean
  bpm: number | null
}

let config: AnalyzerConfig = { sampleRate: 44100, fftSize: 2048 }

// Rolling history for spectral flux / beat detection
const bassHistory: number[] = []
const beatTimestamps: number[] = []
let prevSpectrum: Float32Array | null = null
let frameCount = 0

function computeEnergy(data: Float32Array, startBin: number, endBin: number): number {
  let sum = 0
  const count = Math.min(endBin, data.length) - startBin
  for (let i = startBin; i < Math.min(endBin, data.length); i++) {
    sum += data[i] * data[i]
  }
  return count > 0 ? Math.sqrt(sum / count) : 0
}

function analyze(frequencyMagnitudes: Float32Array): AnalysisResult {
  frameCount++
  const binCount = frequencyMagnitudes.length

  // Frequency band boundaries (approx for 44.1kHz, 2048 FFT)
  // Each bin = sampleRate / fftSize Hz
  const hzPerBin = config.sampleRate / config.fftSize
  const bassBins = Math.floor(300 / hzPerBin)    // 0-300Hz
  const midBins = Math.floor(2000 / hzPerBin)    // 300-2000Hz
  // High = 2000Hz+ to Nyquist

  const bassEnergy = computeEnergy(frequencyMagnitudes, 0, bassBins)
  const midEnergy = computeEnergy(frequencyMagnitudes, bassBins, midBins)
  const highEnergy = computeEnergy(frequencyMagnitudes, midBins, binCount)

  // Spectral Flux: sum of positive differences from prev frame
  let spectralFlux = 0
  if (prevSpectrum && prevSpectrum.length === binCount) {
    for (let i = 0; i < bassBins; i++) {
      const diff = frequencyMagnitudes[i] - prevSpectrum[i]
      if (diff > 0) spectralFlux += diff
    }
  }
  prevSpectrum = new Float32Array(frequencyMagnitudes)

  // Beat detection via bass flux threshold
  bassHistory.push(spectralFlux)
  if (bassHistory.length > 30) bassHistory.shift() // ~0.5s window at 60fps

  const avgFlux = bassHistory.reduce((a, b) => a + b, 0) / bassHistory.length
  const threshold = avgFlux * 1.4 + 0.01 // Dynamic threshold
  const isBeat = spectralFlux > threshold && spectralFlux > 0.02

  // BPM estimation from recent beat timestamps
  let bpm: number | null = null
  if (isBeat) {
    const now = performance.now()
    beatTimestamps.push(now)
    // Keep last 20 beats
    while (beatTimestamps.length > 20) beatTimestamps.shift()

    if (beatTimestamps.length >= 4) {
      const intervals: number[] = []
      for (let i = 1; i < beatTimestamps.length; i++) {
        intervals.push(beatTimestamps[i] - beatTimestamps[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      if (avgInterval > 200 && avgInterval < 2000) {
        bpm = Math.round(60000 / avgInterval)
      }
    }
  }

  return {
    bassEnergy: Math.min(1.0, bassEnergy),
    midEnergy: Math.min(1.0, midEnergy),
    highEnergy: Math.min(1.0, highEnergy),
    spectralFlux,
    isBeat,
    bpm
  }
}

self.onmessage = (e: MessageEvent) => {
  const msg = e.data

  switch (msg.type) {
    case 'INIT':
      config = { sampleRate: msg.sampleRate, fftSize: msg.fftSize }
      prevSpectrum = null
      bassHistory.length = 0
      beatTimestamps.length = 0
      frameCount = 0
      break

    case 'ANALYZE':
      try {
        const result = analyze(msg.buffer as Float32Array)
        self.postMessage({ type: 'RESULT', data: result })
      } catch (error) {
        self.postMessage({
          type: 'ERROR',
          error: error instanceof Error ? error.message : 'Analysis failed'
        })
      }
      break
  }
}

export {} // Make this a module
