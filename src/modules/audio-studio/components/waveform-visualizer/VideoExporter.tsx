'use client'

import { useRef, useState, useCallback } from 'react'
import { AudioData } from '@/modules/audio-studio/hooks/useAudioEngine'
import { ColorPalette } from '@/modules/audio-studio/lib/palettes'

function withAlpha(color: string, alpha: number): string {
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (rgbMatch) return `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},${alpha})`
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}

interface Props {
  audioData: AudioData
  palette: ColorPalette
  sensitivity: number
  onClose: () => void
  motionBlur?: number
  rgbSplit?: number
}

export default function VideoExporter({ audioData, palette, sensitivity, onClose, motionBlur = 0, rgbSplit = 0 }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(10)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animFrameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const renderFrame = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Simple animated bars for export
    ctx.fillStyle = palette.bg
    ctx.fillRect(0, 0, w, h)

    const bars = 80
    for (let i = 0; i < bars; i++) {
      const dataIdx = Math.floor((i / bars) * audioData.frequencyData.length)
      const val = (audioData.frequencyData[dataIdx] / 255) * sensitivity
      const animated = val * (0.85 + 0.15 * Math.sin(t * 3 + i * 0.3))
      const barH = animated * h * 0.8
      const barW = w / bars
      const x = i * barW

      const color = palette.getColor(animated, i, bars)
      const grad = ctx.createLinearGradient(x, h, x, h - barH)
      grad.addColorStop(0, color)
      grad.addColorStop(1, withAlpha(color, 0.27))
      ctx.fillStyle = grad
      ctx.fillRect(x + 1, h - barH, barW - 2, barH)
    }

    // Title overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, h - 40, w, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px monospace'
    ctx.fillText('WAVEFORM VISUALIZER', 12, h - 14)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '10px monospace'
    ctx.fillText(palette.name, 12, h - 28)
  }, [audioData, palette, sensitivity])

  const startRecording = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    chunksRef.current = []
    setDownloadUrl(null)
    setIsRecording(true)
    setProgress(0)
    timeRef.current = 0
    startTimeRef.current = Date.now()

    const stream = canvas.captureStream(30)
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
    })
    recorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setIsRecording(false)
      setProgress(100)
      cancelAnimationFrame(animFrameRef.current)
    }

    recorder.start(100)

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const prog = Math.min((elapsed / duration) * 100, 100)
      setProgress(Math.round(prog))
      timeRef.current = elapsed

      const ctx = canvas.getContext('2d')
      if (ctx) renderFrame(ctx, canvas.width, canvas.height, elapsed)

      if (elapsed >= duration) {
        recorder.stop()
        return
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }, [duration, renderFrame])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    cancelAnimationFrame(animFrameRef.current)
    setIsRecording(false)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '16px',
        padding: '24px',
        width: '340px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ color: '#00ff88', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700 }}>VIDEO EXPORT</span>
          <button onClick={onClose} style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <canvas
          ref={canvasRef}
          width={300}
          height={180}
          style={{ width: '100%', borderRadius: '8px', border: '1px solid #222', display: 'block', marginBottom: '16px' }}
        />

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>
            DURATION: {duration}s
          </label>
          <input
            type="range"
            min={5}
            max={60}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            disabled={isRecording}
            style={{ width: '100%' }}
          />
        </div>

        {isRecording && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00ff88, #00cfff)',
                borderRadius: '2px',
                transition: 'width 0.1s',
              }} />
            </div>
            <span style={{ color: '#666', fontSize: '10px', fontFamily: 'monospace' }}>{progress}% • {Math.round(duration * progress / 100)}s / {duration}s</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          {!isRecording ? (
            <button
              onClick={startRecording}
              style={{
                flex: 1,
                padding: '10px',
                background: '#00ff8822',
                border: '1px solid #00ff8844',
                borderRadius: '8px',
                color: '#00ff88',
                fontFamily: 'monospace',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ⏺ START RECORDING
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={{
                flex: 1,
                padding: '10px',
                background: '#ff336622',
                border: '1px solid #ff336644',
                borderRadius: '8px',
                color: '#ff3366',
                fontFamily: 'monospace',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ⏹ STOP
            </button>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`waveform_export_${palette.id}.webm`}
              style={{
                flex: 1,
                padding: '10px',
                background: '#00cfff22',
                border: '1px solid #00cfff44',
                borderRadius: '8px',
                color: '#00cfff',
                fontFamily: 'monospace',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ⬇ DOWNLOAD
            </a>
          )}
        </div>

        <p style={{ color: '#444', fontSize: '10px', fontFamily: 'monospace', marginTop: '12px', textAlign: 'center' }}>
          Exports as WebM video • Compatible with most editors
        </p>
      </div>
    </div>
  )
}
