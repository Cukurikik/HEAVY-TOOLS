'use client'

import { useRef, useEffect, useCallback } from 'react'
import { AudioData } from '@/modules/audio-studio/hooks/useAudioEngine'
import { useVisualizerStore, VisualizerElement, ImageElement, BarsElement, ParticlesElement, MotionBlurEffectElement, RadialSpectrumElement } from '@/modules/audio-studio/store/useVisualizerStore'

interface Props {
  audioData: AudioData
  isBeat: boolean
  sensitivity: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  colorIdx: number
  size: number
}

// Ensure hex colors work with alpha
function withAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function VisualizerCanvas({ audioData, isBeat, sensitivity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const beatImpactRef = useRef<number>(0)
  const prevBeatTimeRef = useRef<number>(0) // Added prevBeatTimeRef
  const bassHistoryRef = useRef<number[]>([]) // NEW: for transient isolation
  
  // State from store
  const { elements } = useVisualizerStore()
  
  // Persistent contexts for elements
  const particlesMap = useRef<Map<string, Particle[]>>(new Map())

  // ---- RENDERERS ----

  const applyMotionBlur = useCallback((ctx: CanvasRenderingContext2D, el: MotionBlurEffectElement, w: number, h: number, impact: number) => {
    ctx.resetTransform()
    ctx.globalCompositeOperation = 'source-over'
    
    // blurAmount: 0 = no trails (alpha 1.0), 1 = max trails (alpha 0.05)
    // If beat drops, let's lower alpha slightly more to "streak" the fast movement
    const baseAlpha = Math.max(0.05, 1.0 - (el.blurAmount * 0.95))
    const finalAlpha = Math.max(0.05, baseAlpha - (impact * 0.1))
    
    ctx.fillStyle = `rgba(0,0,0,${finalAlpha})`
    ctx.fillRect(0, 0, w, h)

    // RGB Split / Aberration Ghosting (Softened to prevent blinding flashes)
    if (impact > 0.05 && el.rgbSplitAmount > 0) {
      const splitDist = impact * el.rgbSplitAmount * 40 // reduced max shift
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = impact * 0.15 // Much softer alpha
      
      ctx.translate(w / 2, h / 2)
      ctx.scale(1.01 + (impact * 0.02), 1.01 + (impact * 0.02))
      
      ctx.drawImage(ctx.canvas, -w / 2 - splitDist, -h / 2)
      ctx.drawImage(ctx.canvas, -w / 2 + splitDist, -h / 2)
      
      ctx.restore()
    }
  }, [])

  const drawBars = useCallback((ctx: CanvasRenderingContext2D, el: BarsElement, data: Uint8Array) => {
    const { barCount, barWidth, color, roundness } = el
    const totalWidth = barCount * (barWidth + 2)
    const startX = -totalWidth / 2

    // Focus on the first 60% of frequency bins (up to ~12kHz where most musical energy sits)
    const activeDataLen = Math.floor(data.length * 0.6)

    ctx.fillStyle = color
    ctx.shadowBlur = 0 // FORCED ANTI-EPILEPSY

    for (let i = 0; i < barCount; i++) {
      // Logarithmic frequency stretching to make the spectrum highly dynamic
      const dataIdx = Math.floor(Math.pow(i / barCount, 1.2) * activeDataLen)
      const value = data[dataIdx] || 0
      
      // Treble Boost: Multiply high frequencies artificially (up to 3x) to compensate for low acoustic energy
      const trebleBoost = 1 + ((i / barCount) * 2.0)
      const amp = (value / 255) * sensitivity * trebleBoost
      
      const barH = Math.max(2, amp * 200)

      const x = startX + i * (barWidth + 2)
      const y = -barH / 2 // centered on local transform

      if (roundness > 0) {
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barH, roundness)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, barWidth, barH)
      }
    }
  }, [sensitivity])

  const drawRadialSpectrum = useCallback((ctx: CanvasRenderingContext2D, el: RadialSpectrumElement, data: Uint8Array, time: number) => {
    const { radius, barCount, color, rotationSpeed } = el
    const barWidth = (el as any).barWidth ?? 16
    const roundness = (el as any).roundness ?? 8
    const spectrumType = (el as any).spectrumType || 'Bars'
    
    // Low-pass logarithmic bounds
    const activeDataLen = Math.floor(data.length * 0.6)

    ctx.rotate(time * rotationSpeed)
    
    ctx.shadowBlur = 0 // FORCED ANTI-EPILEPSY

    if (spectrumType === 'Line') {
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      
      const drawRingPass = (scaleMultiplier: number, alphaMultiplier: number, thickness: number) => {
        ctx.globalAlpha = alphaMultiplier
        ctx.strokeStyle = color
        ctx.lineWidth = thickness
        ctx.beginPath()
        
        for (let i = 0; i <= barCount; i++) {
          const normalizedI = i === barCount ? 0 : i
          const MathAngle = (normalizedI / barCount) * Math.PI * 2
          
          const dataIdx = Math.floor(Math.pow(normalizedI / barCount, 1.2) * activeDataLen)
          const value = data[dataIdx] || 0
          
          const trebleBoost = 1 + ((normalizedI / barCount) * 2.0)
          const amp = (value / 255) * sensitivity * trebleBoost
          
          const h = amp * 150 * scaleMultiplier
          
          const r = radius + h
          const x = Math.cos(MathAngle - Math.PI/2) * r
          const y = Math.sin(MathAngle - Math.PI/2) * r
          
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.globalAlpha = 1.0
      }

      // 3 overlapping passes mirroring the 4 stacked compositions in visualizer_19.viz 
      // This creates the super thick "Gemuk" puffy wave Line
      ctx.globalCompositeOperation = 'lighter'
      drawRingPass(1.2, 0.4, Math.max(2, barWidth * 0.5)) // Highest peaks, faint, thin
      drawRingPass(1.0, 0.7, Math.max(3, barWidth * 0.8)) // Medium peaks, semi-transparent
      drawRingPass(0.8, 1.0, Math.max(4, barWidth))       // Base peaks, fully opaque, very thick
      
    } else {
      ctx.fillStyle = color
      for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor(Math.pow(i / barCount, 1.2) * activeDataLen)
        const value = data[dataIdx] || 0
        
        const trebleBoost = 1 + ((i / barCount) * 2.0)
        const amp = (value / 255) * sensitivity * trebleBoost
        
        const h = Math.max(barWidth / 2, amp * 150) // Amplified height for chunkier look

        const angle = (i / barCount) * Math.PI * 2
        ctx.save()
        ctx.rotate(angle)
        ctx.translate(0, -radius)
        
        if (roundness > 0) {
          ctx.beginPath()
          ctx.roundRect(-barWidth / 2, -h, barWidth, h, roundness)
          ctx.fill()
        } else {
          ctx.fillRect(-barWidth / 2, -h, barWidth, h)
        }
        
        ctx.restore()
      }
    }
  }, [sensitivity])

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, el: ParticlesElement, w: number, h: number, data: Uint8Array, impact: number) => {
    let parts = particlesMap.current.get(el.id)
    if (!parts || parts.length !== el.particleCount) {
      parts = Array.from({ length: el.particleCount }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        colorIdx: 0,
        size: Math.random() * 2.5 + 0.5
      }))
      particlesMap.current.set(el.id, parts)
    }

    let lowEnergy = 0
    for(let i=0; i<10; i++) lowEnergy += data[i]
    lowEnergy = (lowEnergy / 10 / 255) * sensitivity

    ctx.fillStyle = el.color
    ctx.globalAlpha = 0.6 // Consistent calm opacity
    ctx.shadowBlur = 0 // FORCED ANTI-EPILEPSY

    const explosionForce = impact * el.beatExplosion * 30
    const orbitSpeed = (0.002 + lowEnergy * 0.01) * el.speedMultiplier
    const cosO = Math.cos(orbitSpeed)
    const sinO = Math.sin(orbitSpeed)
    const maxRadius = Math.max(w, h) * 0.8

    ctx.beginPath()
    parts.forEach((p) => {
      // Normal drift + audio speedup
      p.x += p.vx * (1 + lowEnergy * 2)
      p.y += p.vy * (1 + lowEnergy * 2)

      const dist = Math.sqrt(p.x * p.x + p.y * p.y) || 1
      const dirX = p.x / dist
      const dirY = p.y / dist
      
      // Explosion
      p.x += dirX * explosionForce
      p.y += dirY * explosionForce
      
      // Orbit
      const nx = p.x * cosO - p.y * sinO
      const ny = p.x * sinO + p.y * cosO
      p.x = nx
      p.y = ny

      // Wrap if exceeding max radius
      if (dist > maxRadius) {
         p.x = dirX * 10
         p.y = dirY * 10
      }

      const radius = p.size * (1 + lowEnergy * 1.5)
      
      ctx.moveTo(p.x, p.y)
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
    })
    // Batched fill is 10x faster than individual looping!
    ctx.fill()
    ctx.globalAlpha = 1.0
  }, [sensitivity])

  // Persistent Image Cache
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map())

  const drawImageNode = useCallback((ctx: CanvasRenderingContext2D, el: ImageElement, impact: number) => {
    ctx.fillStyle = el.color
    ctx.globalAlpha = el.opacity
    ctx.shadowBlur = 0 // ANTI-EPILEPSY

    if (el.imageUrl.includes('circle')) {
      ctx.beginPath()
      ctx.arc(0, 0, 100, 0, Math.PI * 2)
      ctx.fill()
    } else if (el.imageUrl.includes('rect') || el.imageUrl.includes('white') || el.imageUrl.includes('black')) {
      ctx.fillRect(-100, -100, 200, 200)
    } else if (el.imageUrl) {
      let img = imageCacheRef.current.get(el.imageUrl)
      if (!img) {
         img = new Image()
         img.src = el.imageUrl
         imageCacheRef.current.set(el.imageUrl, img)
      }
      
      if (img.complete && img.naturalWidth > 0) {
         // Draw centered
         const w = img.naturalWidth
         const h = img.naturalHeight
         const scale = Math.min(210 / w, 210 / h)
         
         // Enforce a perfect circular crop for uploaded images to match Radial Spectrum geometry seamlessly
         ctx.save()
         ctx.beginPath()
         ctx.arc(0, 0, 105, 0, Math.PI * 2) // 105 radius = 210 width
         ctx.clip()
         
         ctx.drawImage(img, (-w * scale) / 2, (-h * scale) / 2, w * scale, h * scale)
         
         ctx.restore()
      } else {
         // Placeholder while loading
         ctx.font = '14px sans-serif'
         ctx.textAlign = 'center'
         ctx.fillText('Loading Image...', 0, 0)
      }
    }
    
    ctx.globalAlpha = 1
  }, [])


  // ---- MAIN RENDER LOOP ----
  // AVEE PLAYER APPROACH: No beat detection events.
  // Raw bass amplitude is read EVERY FRAME and mapped directly to scale.
  // Bass loud = scale up. Bass quiet = scale down. Zero latency. Perfect sync.
  
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    // =====================================================
    // TRUE TRANSIENT ENVELOPE FOLLOWER (JEDAG JEDUG STYLE)
    // =====================================================
    const freqData = audioData.frequencyData
    
    // 1. Calculate current bass energy (bins 0-12, ~20-300Hz)
    let bassSum = 0
    const bassCount = 12
    for (let i = 0; i < bassCount; i++) bassSum += (freqData[i] || 0)
    const bassEnergy = bassSum / bassCount / 255 // Normalized 0.0 to 1.0
    
    // 2. Maintain short history for derivative (Flux)
    const history = bassHistoryRef.current
    history.push(bassEnergy)
    if (history.length > 4) history.shift() // Keep 4 frames to compute delta
    
    // 3. Compute Spectral Flux (Positive rate of change)
    // Compare current frame against 2 frames ago to catch fast transients
    const prevEnergy = history.length >= 3 ? history[history.length - 3] : history[0]
    let flux = bassEnergy - prevEnergy
    if (flux < 0) flux = 0 // Only care about sudden energy INCREASES (kicks)
    
    // 4. Gate and Normalize the Transient
    // A sudden jump of > 0.02 is a beat, > 0.15 is a massive kick
    let transientImpact = 0
    if (flux > 0.02) { // Noise floor gate
      transientImpact = Math.min(1.0, (flux / 0.15) * sensitivity)
    }

    // 5. Envelope Follower: Instant Attack, Fast Exponential Decay
    if (transientImpact > beatImpactRef.current) {
       beatImpactRef.current = transientImpact // Immediate spike on kick
    } else {
       beatImpactRef.current *= 0.82 // 18% decay per frame (~100ms fade out, very snappy)
    }
    
    const impact = beatImpactRef.current

    // Black background fallback if no MotionBlur layer exists at the bottom
    const hasMotionBlur = elements.some(e => e.objType === 'MotionBlurEffect' && e.visible)
    if (!hasMotionBlur) {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)
    }

    const t = timeRef.current
    timeRef.current += 0.016

    // Iterate Layer Tree
    elements.forEach(el => {
      if (!el.visible) return

      ctx.save()

      // Handle Fullscreen specific nodes first
      if (el.objType === 'MotionBlurEffect') {
        applyMotionBlur(ctx, el as MotionBlurEffectElement, w, h, impact)
        ctx.restore()
        return
      }

      // --- Node Transforms ---
      
      // 1. Position (0.0 - 1.0 mapped to canvas w/h)
      ctx.translate(w * el.position.x, h * el.position.y)

      // 2. Rotation
      let currentRot = el.rotation
      if (el.measureScale.measureWhat === 'TotalTime') {
        currentRot += t * el.measureScale.amountX * 50
      }
      ctx.rotate((currentRot * Math.PI) / 180)

      // 3. Scale — ALWAYS driven by continuous bass amplitude
      let currentSclX = el.scale.x
      let currentSclY = el.scale.y
      
      // Apply bass-driven scale to ALL elements regardless of measureWhat setting
      // measureWhat controls the INTENSITY of the reaction
      const amtX = el.measureScale.amountX
      const amtY = el.measureScale.amountY
      
      if (el.measureScale.measureWhat === 'Beat') {
        // Strong reaction: direct bass amplitude * amount
        currentSclX += impact * amtX * 2.0
        currentSclY += impact * amtY * 2.0
      } else if (el.measureScale.measureWhat === 'TotalTimeAndBeat') {
        currentSclX += impact * amtX * 1.5
        currentSclY += impact * amtY * 1.5
      } else {
        // Even 'Nothing' gets subtle bass breathing
        currentSclX += impact * 0.15
        currentSclY += impact * 0.15
      }
      
      ctx.scale(currentSclX, currentSclY)

      // --- Blend Mode ---
      switch(el.blendMode) {
        case 'Screen': ctx.globalCompositeOperation = 'screen'; break
        case 'Add': ctx.globalCompositeOperation = 'lighter'; break
        case 'Multiply': ctx.globalCompositeOperation = 'multiply'; break
        default: ctx.globalCompositeOperation = 'source-over'; break
      }

      // --- Render Primitive ---
      switch (el.objType) {
        case 'Image':
          drawImageNode(ctx, el as ImageElement, impact)
          break
        case 'Bars':
          drawBars(ctx, el as BarsElement, audioData.frequencyData)
          break
        case 'Particles':
          drawParticles(ctx, el as ParticlesElement, w, h, audioData.frequencyData, impact)
          break
        case 'RadialSpectrum':
          drawRadialSpectrum(ctx, el as RadialSpectrumElement, audioData.frequencyData, t)
          break
      }

      ctx.restore()
    })

    frameRef.current = requestAnimationFrame(render)
  }, [elements, audioData, sensitivity, applyMotionBlur, drawBars, drawParticles, drawImageNode, drawRadialSpectrum])

  // --- Animation Loop ---
  useEffect(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(frameRef.current)
  }, [render])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return
      const parent = canvasRef.current.parentElement
      if (parent) {
        canvasRef.current.width = parent.clientWidth
        canvasRef.current.height = parent.clientHeight
      }
    }
    handleResize()
    const ro = new ResizeObserver(handleResize)
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement)
    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        backgroundColor: '#000'
      }}
    />
  )
}
