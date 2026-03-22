'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { AudioData } from '@/modules/audio-studio/hooks/useAudioEngine'

interface Props {
  audioData: AudioData
  sensitivity: number
  onClose: () => void
}

/**
 * VideoExporter — Captures the actual live VisualizerCanvas via captureStream
 * and records it as a WebM video file.
 * 
 * How it works:
 * 1. Finds the main VisualizerCanvas <canvas> element in the DOM.
 * 2. Uses canvas.captureStream(30) to create a MediaStream from it.
 * 3. Records the stream with MediaRecorder.
 * 4. Produces a downloadable WebM blob.
 */
export default function VideoExporter({ audioData, sensitivity, onClose }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(10)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = useCallback(() => {
    // Find the actual visualizer canvas in the DOM
    const allCanvases = document.querySelectorAll('canvas')
    let targetCanvas: HTMLCanvasElement | null = null

    // Find the largest canvas (that's the visualizer)
    let maxArea = 0
    allCanvases.forEach(c => {
      const area = c.width * c.height
      if (area > maxArea) {
        maxArea = area
        targetCanvas = c
      }
    })

    if (!targetCanvas) {
      alert('No visualizer canvas found. Make sure the visualizer is running.')
      return
    }

    chunksRef.current = []
    setDownloadUrl(null)
    setIsRecording(true)
    setProgress(0)
    startTimeRef.current = Date.now()

    const stream = (targetCanvas as HTMLCanvasElement).captureStream(30)

    // --- Audio capture: try to get audio from the page too ---
    // This is a best-effort attempt; not all browsers support getDisplayMedia in this context
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'

    const recorder = new MediaRecorder(stream, { mimeType })
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
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    recorder.start(100) // Collect data every 100ms

    // Progress tracker
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const prog = Math.min((elapsed / duration) * 100, 100)
      setProgress(Math.round(prog))

      if (elapsed >= duration) {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop()
        }
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 100)
  }, [duration])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRecording(false)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 w-[380px] shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <span className="text-teal-400 font-mono text-sm font-bold tracking-wider">VIDEO EXPORT</span>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Captures live canvas → WebM</p>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Info */}
        <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3 mb-4">
          <p className="text-[10px] text-teal-400/80 font-mono leading-relaxed">
            ✦ Records your <strong>live visualizer</strong> canvas in real-time.
            <br />✦ Play audio before starting to capture audio-reactive visuals.
            <br />✦ Output: WebM video at 30 fps.
          </p>
        </div>

        {/* Duration Control */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">Duration</label>
            <span className="text-teal-400 text-xs font-mono font-bold">{duration}s</span>
          </div>
          <input
            type="range"
            min={5}
            max={120}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            disabled={isRecording}
            className="w-full accent-teal-500"
          />
        </div>

        {/* Progress */}
        {isRecording && (
          <div className="mb-4">
            <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00ff88, #00cfff)' }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-slate-500 text-[10px] font-mono">{progress}%</span>
              <span className="text-slate-500 text-[10px] font-mono">
                {Math.round(duration * progress / 100)}s / {duration}s
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex-1 py-2.5 px-4 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400 font-mono text-xs font-bold hover:bg-teal-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-red-400">⏺</span> START RECORDING
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 py-2.5 px-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
              ⏹ STOP
            </button>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`waveforge_export_${Date.now()}.webm`}
              className="flex-1 py-2.5 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2 no-underline"
            >
              ⬇ DOWNLOAD
            </a>
          )}
        </div>

        <p className="text-slate-600 text-[10px] font-mono mt-3 text-center">
          WebM format • Works in Chrome, Edge, Firefox
        </p>
      </div>
    </div>
  )
}
