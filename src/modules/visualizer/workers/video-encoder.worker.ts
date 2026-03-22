// ============================================================
// video-encoder.worker.ts — Web Worker for WebM Video Encoding
// Uses WebCodecs VideoEncoder API for high-perf frame encoding
// ============================================================

/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope

interface EncoderConfig {
  width: number
  height: number
  frameRate: number
  bitrate: number
}

let encoder: VideoEncoder | null = null
let muxedChunks: { data: Uint8Array; timestamp: number; type: string }[] = []
let config: EncoderConfig | null = null
let totalFrames = 0
let processedFrames = 0

function initEncoder(cfg: EncoderConfig) {
  config = cfg
  muxedChunks = []
  totalFrames = 0
  processedFrames = 0

  // Check if VideoEncoder is available
  if (typeof VideoEncoder === 'undefined') {
    self.postMessage({
      type: 'ERROR',
      error: 'VideoEncoder API not available. Use Chrome 94+ or Edge 94+.'
    })
    return
  }

  encoder = new VideoEncoder({
    output: (chunk: EncodedVideoChunk) => {
      const data = new Uint8Array(chunk.byteLength)
      chunk.copyTo(data)
      muxedChunks.push({
        data,
        timestamp: chunk.timestamp,
        type: chunk.type
      })
      processedFrames++
      
      if (totalFrames > 0) {
        self.postMessage({
          type: 'PROGRESS',
          percent: Math.round((processedFrames / totalFrames) * 100)
        })
      }
    },
    error: (e: DOMException) => {
      self.postMessage({ type: 'ERROR', error: e.message })
    }
  })

  encoder.configure({
    codec: 'vp8',
    width: cfg.width,
    height: cfg.height,
    bitrate: cfg.bitrate,
    framerate: cfg.frameRate
  })

  self.postMessage({ type: 'READY' })
}

async function encodeFrame(imageData: ImageData, timestamp: number) {
  if (!encoder || encoder.state === 'closed') return

  // Convert ImageData to VideoFrame using buffer overload
  const frame = new VideoFrame(imageData.data.buffer, {
    format: 'RGBA',
    codedWidth: imageData.width,
    codedHeight: imageData.height,
    timestamp: timestamp * 1000, // microseconds
  })
  
  const keyFrame = processedFrames % 60 === 0 // Keyframe every 60 frames
  encoder.encode(frame, { keyFrame })
  frame.close()

  totalFrames++
}

async function finish() {
  if (!encoder || encoder.state === 'closed') return

  await encoder.flush()
  encoder.close()

  // Basic WebM muxing — concatenate raw encoded chunks
  // For production, use a proper muxer like webm-muxer
  // For now, create a simple blob of encoded data
  const totalSize = muxedChunks.reduce((sum, c) => sum + c.data.byteLength, 0)
  const combined = new Uint8Array(totalSize)
  let offset = 0
  for (const chunk of muxedChunks) {
    combined.set(chunk.data, offset)
    offset += chunk.data.byteLength
  }

  const blob = new Blob([combined], { type: 'video/webm' })

  self.postMessage({ type: 'DONE', blob })

  // Cleanup
  muxedChunks = []
  encoder = null
}

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data

  switch (msg.type) {
    case 'INIT':
      initEncoder(msg.config as EncoderConfig)
      break

    case 'FRAME':
      await encodeFrame(msg.imageData as ImageData, msg.timestamp as number)
      break

    case 'FINISH':
      await finish()
      break
  }
}

export {} // Make this a module
