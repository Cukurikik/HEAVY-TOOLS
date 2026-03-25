'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useVisualizerStore, ElementType, VisualizerElement } from '@/modules/visualizer/store/useVisualizerStore'

const TYPE_ICONS: Record<ElementType, string> = {
  Image: '🖼️',
  Bars: '📊',
  Particles: '✨',
  MotionBlurEffect: '🌫️',
  RadialSpectrum: '⭕'
}

function SortableLayerItem({ el }: { el: VisualizerElement }) {
  const { activeElementId, setActiveElement, removeElement } = useVisualizerStore()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: el.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all group relative
        ${activeElementId === el.id 
          ? 'bg-teal-500/15 border border-teal-500/30 inset-shadow-teal-500/20' 
          : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'}
        ${isDragging ? 'opacity-50 ring-2 ring-teal-500' : 'opacity-100'}
      `}
      onClick={() => setActiveElement(el.id)}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab hover:bg-white/10 p-1 rounded active:cursor-grabbing text-slate-500"
        >
          ⠿
        </div>
        
        <span className={`text-sm ${activeElementId === el.id ? 'opacity-100' : 'opacity-60 grayscale'}`}>
          {TYPE_ICONS[el.objType]}
        </span>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className={`text-xs font-semibold truncate ${activeElementId === el.id ? 'text-teal-50' : 'text-slate-300'}`}>
            {el.name}
          </span>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">{el.objType}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2">
        <button 
          onClick={(e) => { e.stopPropagation(); removeElement(el.id) }} 
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-500/70 hover:text-red-400 transition-colors bg-[#0d0d12]"
          title="Delete Layer"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function LayerPanel() {
  const { elements, loadScene, addElement } = useVisualizerStore()
  const [showAddMenu, setShowAddMenu] = useState(false)

  const reversedElementsMemo = useMemo(() => [...elements].reverse(), [elements])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (active.id !== over?.id && over) {
      // Due to displaying in reverse order (top layer = end of array), 
      // we need to map the visual indices back to array indices.
      // But actually, if we reverse the array before passing to SortableContext,
      // it handles it smoothly, provided we map back correctly.
      
      const reversedElements = [...elements].reverse()
      const oldIndex = reversedElements.findIndex(e => e.id === active.id)
      const newIndex = reversedElements.findIndex(e => e.id === over.id)
      
      const newReversedElements = arrayMove(reversedElements, oldIndex, newIndex)
      loadScene([...newReversedElements].reverse())
    }
  }

  return (
    <div className="w-72 bg-[#0d0d12] border-r border-white/5 flex flex-col h-full text-sm text-slate-300 font-sans shadow-2xl z-10 relative">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
        <span className="font-black text-white text-xs tracking-widest uppercase opacity-80">Layers.Stack</span>
        <div className="relative">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white transition-all text-lg font-light leading-none"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Add Layer Dropdown overlay */}
      {showAddMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
          <div className="absolute right-4 top-14 w-48 bg-[#111116] border border-white/10 rounded-xl p-2 shadow-2xl z-50">
            <p className="text-[10px] font-bold text-slate-500 mb-2 px-2 uppercase tracking-wider">Add Element</p>
            {Object.keys(TYPE_ICONS).map((type) => (
              <button
                key={type}
                onClick={() => {
                    addElement(type as ElementType)
                    setShowAddMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-teal-500/20 hover:text-teal-300 transition-colors flex items-center gap-2"
              >
                <span>{TYPE_ICONS[type as ElementType]}</span>
                <span>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
              </button>
            ))}
          </div>
        </>
      )}
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col gap-1">
            <SortableContext 
              items={reversedElementsMemo.map(e => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {reversedElementsMemo.map(el => (
                <SortableLayerItem key={el.id} el={el} />
              ))}
            </SortableContext>
          </div>
        </DndContext>

        {elements.length === 0 && (
          <div className="text-center p-6 text-xs text-slate-600 font-medium mt-10">
            No layers. Add an element to start composing.
          </div>
        )}
      </div>
    </div>
  )
}
