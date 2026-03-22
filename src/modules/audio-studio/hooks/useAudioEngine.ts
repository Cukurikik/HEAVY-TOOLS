'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

export interface AudioData {
  frequencyData: Uint8Array
  timeData: Uint8Array
  volume: number
  bass: number
  mid: number
  treble: number
  isBeat: boolean
  lastBeatTime: number
  bpm: number
  spectrogramHistory: Uint8Array[]
}

export interface AudioEngineState {
  isPlaying: boolean
  isMicActive: boolean
  isLoading: boolean
  isRepeat: boolean
  fileName: string
  duration: number
  currentTime: number
  volume: number
  fftSize: number
  audioData: AudioData
}

const FFT_SIZE = 2048

export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | MediaStreamAudioSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const pauseOffsetRef = useRef<number>(0)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const spectrogramHistoryRef = useRef<Uint8Array[]>([])

  // Beat detection refs (WaveForge-style)
  const beatEnergyHistoryRef = useRef<number[]>([])
  const beatTimerRef = useRef<number>(0) // cooldown frames
  const beatIntervalsRef = useRef<number[]>([])
  const lastBeatTimeRef = useRef<number>(0)

  // Configurable beat settings
  const beatThresholdRef = useRef<number>(1.15)
  const beatEnabledRef = useRef<boolean>(true)

  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    isMicActive: false,
    isLoading: false,
    isRepeat: false,
    fileName: '',
    duration: 0,
    currentTime: 0,
    volume: 0.8,
    fftSize: FFT_SIZE,
    audioData: {
      frequencyData: new Uint8Array(FFT_SIZE / 2),
      timeData: new Uint8Array(FFT_SIZE),
      volume: 0,
      bass: 0,
      mid: 0,
      treble: 0,
      isBeat: false,
      lastBeatTime: 0,
      bpm: 0,
      spectrogramHistory: [],
    },
  })

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext()
      const analyser = audioCtxRef.current.createAnalyser()
      analyser.fftSize = FFT_SIZE
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const gain = audioCtxRef.current.createGain()
      gainRef.current = gain

      analyser.connect(gain)
      gain.connect(audioCtxRef.current.destination)
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  /**
   * WaveForge-style energy-based beat detection:
   * - RMS energy of first 12% frequency bins (bass range)
   * - 50-frame rolling average
   * - Beat fires when energy > avg * threshold AND energy > 50
   * - 8-frame cooldown to prevent double-triggers
   */
  const detectBeat = useCallback((freqData: Uint8Array): boolean => {
    if (!beatEnabledRef.current) return false

    const sampleRate = audioCtxRef.current?.sampleRate || 44100
    // Target up to 400Hz where strong percussion impacts live
    const bassEnd = Math.max(4, Math.floor((400 / (sampleRate / 2)) * freqData.length))
    
    let sum = 0
    for (let i = 0; i < bassEnd; i++) {
        sum += freqData[i] * freqData[i]
    }
    const energy = Math.sqrt(sum / bassEnd)

    // Cooldown timer (8 frames = ~130ms) prevents double triggering on echoes
    if (beatTimerRef.current > 0) {
      beatTimerRef.current--
    }

    // Maintain 50-frame energy history
    const history = beatEnergyHistoryRef.current
    history.push(energy)
    if (history.length > 50) history.shift()

    // -------------------------------------------------------------
    // TRUE SPECTRAL FLUX (TRANSIENT) DETECTOR
    // -------------------------------------------------------------
    const prevEnergy = history.length >= 2 ? history[history.length - 2] : energy
    const flux = energy - prevEnergy // Rate of change

    const avg = history.reduce((a, b) => a + b, 0) / history.length
    
    // Adaptive flux threshold - louder sections require a harder transient spike to trigger
    const requiredSpike = 8 + (avg * 0.15) 

    // If energy spikes suddenly by the required amount AND base energy > 40
    if (flux > requiredSpike && energy > 40 && beatTimerRef.current <= 0) {
      beatTimerRef.current = 8 // 8-frame cooldown (~130ms)

      // BPM tracking
      const now = Date.now()
      const interval = now - lastBeatTimeRef.current
      lastBeatTimeRef.current = now
      if (interval > 200 && interval < 2000) {
        beatIntervalsRef.current.push(interval)
        if (beatIntervalsRef.current.length > 12) beatIntervalsRef.current.shift()
      }

      return true
    }
    return false
  }, [])

  const getBPM = useCallback((): number => {
    const intervals = beatIntervalsRef.current
    if (intervals.length < 3) return 0
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const bpm = Math.round(60000 / avg)
    return bpm > 40 && bpm < 240 ? bpm : 0
  }, [])

  const tick = useCallback(() => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const freqData = new Uint8Array(bufferLength)
    const timeData = new Uint8Array(analyserRef.current.fftSize)

    analyserRef.current.getByteFrequencyData(freqData)
    analyserRef.current.getByteTimeDomainData(timeData)

    // Volume RMS
    let volSum = 0
    for (let i = 0; i < timeData.length; i++) {
      const v = (timeData[i] - 128) / 128
      volSum += v * v
    }
    const volume = Math.sqrt(volSum / timeData.length)

    // Frequency bands
    const sampleRate = audioCtxRef.current?.sampleRate || 44100
    const bassEnd = Math.floor((250 / sampleRate) * bufferLength)
    const midEnd = Math.floor((2000 / sampleRate) * bufferLength)
    const trebleEnd = Math.floor((8000 / sampleRate) * bufferLength)

    let bassSum = 0, midSum = 0, trebleSum = 0
    for (let i = 0; i < bassEnd; i++) bassSum += freqData[i]
    for (let i = bassEnd; i < midEnd; i++) midSum += freqData[i]
    for (let i = midEnd; i < trebleEnd; i++) trebleSum += freqData[i]

    const bass = bassEnd > 0 ? bassSum / bassEnd / 255 : 0
    const mid = (midEnd - bassEnd) > 0 ? midSum / (midEnd - bassEnd) / 255 : 0
    const treble = (trebleEnd - midEnd) > 0 ? trebleSum / (trebleEnd - midEnd) / 255 : 0

    // Beat detection using frequency data directly
    const isBeat = detectBeat(freqData)
    if (isBeat) {
      lastBeatTimeRef.current = performance.now()
    }
    const bpm = getBPM()

    // Spectrogram history
    const history = spectrogramHistoryRef.current
    history.push(new Uint8Array(freqData))
    if (history.length > 200) history.shift()

    const currentTime = audioCtxRef.current
      ? audioCtxRef.current.currentTime - startTimeRef.current + pauseOffsetRef.current
      : 0

    setState(prev => ({
      ...prev,
      currentTime: Math.max(0, currentTime),
      audioData: {
        frequencyData: freqData,
        timeData,
        volume,
        bass,
        mid,
        treble,
        isBeat,
        lastBeatTime: lastBeatTimeRef.current,
        bpm,
        spectrogramHistory: [...history],
      },
    }))

    animFrameRef.current = requestAnimationFrame(tick)
  }, [detectBeat, getBPM])

  const stopSource = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect()
        if (sourceRef.current instanceof AudioBufferSourceNode) {
          sourceRef.current.stop()
        }
      } catch {}
      sourceRef.current = null
    }
  }, [])

  const loadFile = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true }))
    cancelAnimationFrame(animFrameRef.current)
    stopSource()

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }

    const ctx = ensureAudioContext()
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
    audioBufferRef.current = audioBuffer
    pauseOffsetRef.current = 0

    // Reset beat detection state when loading new file
    beatEnergyHistoryRef.current = []
    beatTimerRef.current = 0
    beatIntervalsRef.current = []
    lastBeatTimeRef.current = 0

    setState(prev => ({
      ...prev,
      isLoading: false,
      isPlaying: false,
      isMicActive: false,
      fileName: file.name,
      duration: audioBuffer.duration,
      currentTime: 0,
    }))
  }, [ensureAudioContext, stopSource])

  const play = useCallback(() => {
    if (!audioBufferRef.current) return
    const ctx = ensureAudioContext()
    stopSource()

    const source = ctx.createBufferSource()
    source.buffer = audioBufferRef.current
    source.connect(analyserRef.current!)
    
    // If repeat is on, use Web Audio loop
    source.loop = state.isRepeat
    
    source.start(0, pauseOffsetRef.current)
    source.onended = () => {
      // If loop is handled natively by Web Audio, this won't fire.
      // This fires only when loop is off and audio finishes.
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
      pauseOffsetRef.current = 0
      cancelAnimationFrame(animFrameRef.current)
    }
    sourceRef.current = source
    startTimeRef.current = ctx.currentTime

    setState(prev => ({ ...prev, isPlaying: true }))
    animFrameRef.current = requestAnimationFrame(tick)
  }, [ensureAudioContext, stopSource, tick, state.isRepeat])

  const pause = useCallback(() => {
    if (!audioCtxRef.current) return
    pauseOffsetRef.current += audioCtxRef.current.currentTime - startTimeRef.current
    stopSource()
    cancelAnimationFrame(animFrameRef.current)
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [stopSource])

  const seek = useCallback((time: number) => {
    pauseOffsetRef.current = time
    const wasPlaying = state.isPlaying
    if (wasPlaying) {
      stopSource()
      cancelAnimationFrame(animFrameRef.current)
      setState(prev => ({ ...prev, isPlaying: false }))
      setTimeout(() => play(), 50)
    } else {
      setState(prev => ({ ...prev, currentTime: time }))
    }
  }, [state.isPlaying, stopSource, play])

  const startMic = useCallback(async () => {
    cancelAnimationFrame(animFrameRef.current)
    stopSource()

    const ctx = ensureAudioContext()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    streamRef.current = stream

    const source = ctx.createMediaStreamSource(stream)
    source.connect(analyserRef.current!)
    sourceRef.current = source

    setState(prev => ({
      ...prev,
      isMicActive: true,
      isPlaying: false,
      fileName: 'Microphone Input',
    }))
    animFrameRef.current = requestAnimationFrame(tick)
  }, [ensureAudioContext, stopSource, tick])

  const stopMic = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    stopSource()
    cancelAnimationFrame(animFrameRef.current)
    setState(prev => ({ ...prev, isMicActive: false }))
  }, [stopSource])

  const setVolume = useCallback((vol: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = vol
    }
    setState(prev => ({ ...prev, volume: vol }))
  }, [])

  /** Set the beat detection threshold (1.0 = very sensitive, 2.0 = very strict, default 1.3) */
  const setBeatThreshold = useCallback((threshold: number) => {
    beatThresholdRef.current = threshold
  }, [])

  /** Enable or disable beat detection entirely */
  const setBeatEnabled = useCallback((enabled: boolean) => {
    beatEnabledRef.current = enabled
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      stopSource()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close()
      }
    }
  }, [stopSource])

  const toggleRepeat = useCallback(() => {
    setState(prev => ({ ...prev, isRepeat: !prev.isRepeat }))
    // If a source is currently playing, toggle its loop property live
    if (sourceRef.current && sourceRef.current instanceof AudioBufferSourceNode) {
      sourceRef.current.loop = !state.isRepeat
    }
  }, [state.isRepeat])

  return {
    state,
    loadFile,
    play,
    pause,
    seek,
    startMic,
    stopMic,
    setVolume,
    setBeatThreshold,
    setBeatEnabled,
    toggleRepeat,
  }
}
