'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAudioEngine } from '@/modules/audio-studio/hooks/useAudioEngine'
import { useVisualizerStore } from '@/modules/visualizer/store/useVisualizerStore'
import { AVEE_TEMPLATES } from '@/modules/audio-studio/lib/templates'
import LayerPanel from '@/modules/visualizer/components/editor/LayerPanel'
import InspectorPanel from '@/modules/visualizer/components/editor/InspectorPanel'
import { Play, Square, Mic, FolderOpen, Maximize, FileOutput, Upload, Download, LayoutTemplate, MessageSquareText, Repeat } from 'lucide-react'
import * as jsmediatags from 'jsmediatags'
import LyricOverlay from '@/modules/visualizer/components/LyricOverlay'
import styles from './VisualizerPage.module.css'

const VisualizerCanvas = dynamic(() => import('@/modules/visualizer/components/VisualizerCanvas'), { ssr: false })
const VideoExporter = dynamic(() => import('@/modules/visualizer/components/VideoExporter'), { ssr: false })
const FabricLayerEditor = dynamic(() => import('@/modules/visualizer/components/editor/FabricLayerEditor'), { ssr: false })

export default function WaveformVisualizerPage() {
  const { state, loadFile, play, pause, seek, startMic, stopMic, setVolume, toggleRepeat } = useAudioEngine()
  const { elements, loadScene, albumArt, setLyrics, setAlbumArt } = useVisualizerStore()
  const [showExport, setShowExport] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sensitivity, setSensitivity] = useState(1.0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)
  const lrcFileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) return
    await loadFile(file)

    jsmediatags.read(file, {
      onSuccess: function(tag: any) {
        const picture = tag.tags.picture
        if (picture) {
          let base64String = ""
          for (let i = 0; i < picture.data.length; i++) {
              base64String += String.fromCharCode(picture.data[i])
          }
          const imageUrl = `data:${picture.format};base64,${btoa(base64String)}`
          setAlbumArt(imageUrl)
        } else {
          setAlbumArt(null)
        }
      },
      onError: function(error: any) {
        console.error('jsmediatags error:', error)
        setAlbumArt(null)
      }
    })
  }, [loadFile, setAlbumArt])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handleStop = () => {
    pause()
    seek(0)
  }

  // --- JSON IMPORT / EXPORT ---
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "waveforge_template.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (Array.isArray(json)) {
          loadScene(json)
        } else {
          alert('Invalid JSON structure. Must be an array of layers.')
        }
      } catch {
        alert('Failed to parse JSON file.')
      }
    }
    reader.readAsText(file)
  }

  // --- LRC IMPORT ---
  const handleImportLrc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n')
        const parsedLyrics: { time: number; text: string }[] = []
        const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
        for (const line of lines) {
          const match = timeReg.exec(line)
          if (match) {
            const m = parseInt(match[1], 10)
            const s = parseInt(match[2], 10)
            const ms = parseInt(match[3], 10) * (match[3].length === 2 ? 10 : 1)
            const time = m * 60 + s + ms / 1000
            const textContent = line.replace(timeReg, '').trim()
            if (textContent) {
              parsedLyrics.push({ time, text: textContent })
            }
          }
        }
        setLyrics(parsedLyrics)
      } catch {
        alert('Failed to parse LRC file.')
      }
    }
    reader.readAsText(file)
  }

  const statusClass = state.isPlaying
    ? styles.statusPlaying
    : state.isMicActive
    ? styles.statusMic
    : styles.statusPaused
  const statusText = state.isPlaying ? 'Playing' : state.isMicActive ? 'Live Input' : 'Paused'

  return (
    <div ref={containerRef} className="flex flex-row w-screen h-screen bg-[#050508] overflow-hidden font-sans text-white select-none">
      
      {/* Left Panel */}
      <LayerPanel />

      {/* Center Engine */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-black">
        
        {/* Top Bar OVERLAY */}
        <div className="absolute top-0 left-0 right-0 p-5 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <h1 className="text-3xl font-black tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent leading-none drop-shadow-2xl">WAVEFORGE</h1>
            <div className="flex items-center gap-2 pl-1">
              <div className={statusClass} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{statusText}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {/* Template Library Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowTemplates(!showTemplates)}
                title="Predefined Templates" 
                className={styles.actionBtn}
              >
                <LayoutTemplate size={14} /> TEMPLATES
              </button>
              
              {showTemplates && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                    <p className="text-[10px] font-bold text-slate-500 mb-2 px-2 uppercase tracking-wider">Avee Library</p>
                    {AVEE_TEMPLATES.map((t) => (
                      <button 
                        key={t.id} 
                        onClick={() => {
                           loadScene(t.elements)
                           setShowTemplates(false)
                        }} 
                        className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-teal-500/20 hover:text-teal-300 transition-colors font-semibold tracking-wide"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
            
            <input ref={jsonFileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportJson} />
            <button onClick={() => jsonFileInputRef.current?.click()} title="Import Template JSON" className={styles.actionBtn}><Upload size={14} /> IMPORT VIZ</button>
            <button onClick={handleExportJson} title="Export Template JSON" className={styles.actionBtn}><Download size={14} /> EXPORT VIZ</button>
            
            <input ref={lrcFileInputRef} type="file" accept=".lrc" className="hidden" onChange={handleImportLrc} />
            <button onClick={() => lrcFileInputRef.current?.click()} title="Import Lyrics (.lrc)" className={styles.actionBtn}><MessageSquareText size={14} /> IMPORT LRC</button>
            
            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
            <button onClick={() => setShowExport(true)} title="Render Video" className={styles.actionBtnAccent}><FileOutput size={14} /> RENDER WEBM</button>
            <button onClick={toggleFullscreen} title="Fullscreen" className={`${styles.actionBtn} px-3`}><Maximize size={15} strokeWidth={2.5}/></button>
          </div>
        </div>

        {/* Canvas Engine */}
        <div className={styles.canvasContainer}>
           {albumArt && (
              <div 
                className={styles.albumArtBg}
                style={{ backgroundImage: `url(${albumArt})` }} 
              />
           )}
           <VisualizerCanvas 
             audioData={state.audioData} 
             isBeat={state.audioData.isBeat}
             sensitivity={sensitivity}                                                             
           />
           <FabricLayerEditor />
           <LyricOverlay currentTime={state.currentTime} />
        </div>

        {/* Bottom Bar: Audio Transport */}
        <div className={styles.bottomBar}>
          {/* Progress Slider */}
          <div className="flex items-center px-5 pt-3 gap-4">
             <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400/80 w-10">{formatTime(state.currentTime)}</span>
             <input type="range" min={0} max={state.duration || 1} step={0.01} value={state.currentTime} onChange={e => seek(Number(e.target.value))} className={`flex-1 ${styles.timeSlider}`} />
             <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400/80 w-10 text-right">{formatTime(state.duration)}</span>
          </div>
          {/* Controls row */}
          <div className="flex items-center justify-between px-5 pb-3 flex-1">
             <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <button onClick={() => fileInputRef.current?.click()} className={`${styles.transportBtn} text-amber-400 hover:bg-amber-400/15 border-amber-400/20`}><FolderOpen size={14} strokeWidth={2.5}/> OPEN AUDIO</button>
                <div className="max-w-[150px] truncate text-[10px] font-semibold text-slate-500 uppercase tracking-widest mx-3">{state.fileName || 'NO SOURCE'}</div>
             </div>
             
             <div className="flex items-center gap-2">
                <button onClick={() => state.isMicActive ? stopMic() : startMic()} className={`${styles.transportBtn} ${state.isMicActive ? 'text-red-400 bg-red-400/15 border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white border-white/5'}`}><Mic size={14} strokeWidth={2.5}/> LIVE MIC</button>
                <button onClick={() => state.isPlaying ? pause() : play()} disabled={!state.fileName && !state.isMicActive} className={`${styles.transportBtn} text-teal-400 hover:bg-teal-400/15 border-teal-500/30 disabled:opacity-30 disabled:hover:bg-transparent`}><Play size={14} strokeWidth={2.5}/> {state.isPlaying ? 'PAUSE' : 'PLAY'}</button>
                <button onClick={handleStop} className={`${styles.transportBtn} text-slate-400 hover:bg-white/5 hover:text-white border-white/5`}><Square size={14} strokeWidth={2.5}/> STOP</button>
                <button onClick={toggleRepeat} className={`${styles.transportBtn} ${state.isRepeat ? 'text-teal-400 bg-teal-400/15 border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white border-white/5'}`}><Repeat size={14} strokeWidth={2.5}/> {state.isRepeat ? 'REPEAT ON' : 'REPEAT'}</button>
             </div>
             
             <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SENSITIVITY</span>
                <input type="range" min={0.3} max={3} step={0.1} value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))} className={`w-20 ${styles.timeSlider}`} />
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">VOL</span>
                <input type="range" min={0} max={1} step={0.01} value={state.volume} onChange={e => setVolume(Number(e.target.value))} className={`w-20 ${styles.timeSlider}`} />
             </div>
          </div>
        </div>

      </div>

      {/* Right Panel */}
      <InspectorPanel />

      {/* Export Modal */}
      {showExport && (
        <VideoExporter
          audioData={state.audioData}
          sensitivity={sensitivity}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
