'use client'

import { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { useVisualizerStore } from '@/modules/visualizer/store/useVisualizerStore'

export default function FabricLayerEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const objectMapRef = useRef<Map<string, fabric.Object>>(new Map())
  const isUpdatingFromStoreRef = useRef(false)

  const { elements, activeElementId, setActiveElement, updateElement } = useVisualizerStore()
  const [size, setSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    handleResize()
    const ro = new ResizeObserver(handleResize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return
    const initCanvas = async () => {
      const canvas = new fabric.Canvas(canvasRef.current!, {
        width: size.width,
        height: size.height,
        selection: false,
        preserveObjectStacking: true, 
      })
      fabricRef.current = canvas

      canvas.on('object:modified', (e) => {
        const obj = e.target as any
        if (!obj || !obj.name) return 

        const id = obj.name
        const centerX = obj.getCenterPoint().x
        const centerY = obj.getCenterPoint().y

        updateElement(id, {
          position: { x: centerX / size.width, y: centerY / size.height },
          rotation: obj.angle || 0,
          scale: { x: obj.scaleX || 1, y: obj.scaleY || 1 }
        })
      })

      canvas.on('selection:created', (e) => {
        if (isUpdatingFromStoreRef.current) return
        const obj = e.selected?.[0] as any
        if (obj && obj.name && obj.name !== activeElementId) {
          setActiveElement(obj.name)
        }
      })
      canvas.on('selection:updated', (e) => {
        if (isUpdatingFromStoreRef.current) return
        const obj = e.selected?.[0] as any
        if (obj && obj.name && obj.name !== activeElementId) {
          setActiveElement(obj.name)
        }
      })
      canvas.on('selection:cleared', () => {
        if (isUpdatingFromStoreRef.current) return
        setActiveElement(null)
      })
    }
    
    initCanvas()

    return () => {
      fabricRef.current?.dispose()
      fabricRef.current = null
    }
  }, [size.width, size.height, setActiveElement, updateElement, activeElementId])

  // Sync Elements
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    isUpdatingFromStoreRef.current = true

    const currentIds = new Set(elements.map(e => e.id))
    
    objectMapRef.current.forEach((obj, id) => {
      if (!currentIds.has(id)) {
        canvas.remove(obj)
        objectMapRef.current.delete(id)
      }
    })

    elements.forEach((el, index) => {
      let baseW = 200
      let baseH = 200

      if (el.objType === 'RadialSpectrum') {
         baseW = (el as any).radius * 2.5
         baseH = (el as any).radius * 2.5
      } else if (el.objType === 'Bars') {
         baseW = (el as any).barCount * ((el as any).barWidth + 2)
         baseH = 200
      } else if (el.objType === 'MotionBlurEffect' || el.objType === 'Particles') {
         baseW = size.width * 1.5
         baseH = size.height * 1.5
      }

      let fObj = objectMapRef.current.get(el.id)
      const px = size.width * el.position.x
      const py = size.height * el.position.y

      if (!fObj) {
        fObj = new fabric.Rect({
          width: baseW,
          height: baseH,
          fill: 'transparent',
          stroke: el.objType === 'MotionBlurEffect' ? 'transparent' : 'rgba(20, 184, 166, 0.4)',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          originX: 'center',
          originY: 'center',
          name: el.id,
          selectable: el.objType !== 'MotionBlurEffect' && el.objType !== 'Particles',
          evented: el.objType !== 'MotionBlurEffect' && el.objType !== 'Particles',
          transparentCorners: false,
          cornerColor: '#14b8a6',
          borderColor: '#14b8a6',
          cornerSize: 10,
        })
        objectMapRef.current.set(el.id, fObj)
        canvas.add(fObj)
      }

      fObj.set({
        left: px,
        top: py,
        scaleX: el.scale.x,
        scaleY: el.scale.y,
        angle: el.rotation,
      })
      ;(canvas as any).moveObjectTo(fObj, index)
    })

    if (activeElementId) {
       const activeObj = objectMapRef.current.get(activeElementId)
       if (activeObj && canvas.getActiveObject() !== activeObj) {
         canvas.setActiveObject(activeObj)
       }
    } else {
       canvas.discardActiveObject()
    }

    canvas.requestRenderAll()
    isUpdatingFromStoreRef.current = false

  }, [elements, size.width, size.height, activeElementId])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-auto z-10">
      <canvas ref={canvasRef} />
    </div>
  )
}
