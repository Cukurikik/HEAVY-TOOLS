import { useState, useMemo } from 'react'
import { useVisualizerStore, ElementType } from '@/modules/audio-studio/store/useVisualizerStore'

const TYPE_ICONS: Record<ElementType, string> = {
  Image: '🖼️',
  Bars: '📊',
  Particles: '✨',
  MotionBlurEffect: '🌫️',
  RadialSpectrum: '⭕'
}

export default function LayerPanel() {
  const { elements, activeElementId, setActiveElement, addElement, removeElement } = useVisualizerStore()
  const [showAddMenu, setShowAddMenu] = useState(false)

  const reversedElements = useMemo(() => [...elements].reverse(), [elements])

  return (
    <div className="w-72 bg-[#0d0d12] border-r border-white/5 flex flex-col h-full text-sm text-slate-300 font-sans shadow-2xl z-10">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
        <span className="font-black text-white text-xs tracking-widest uppercase opacity-80">Layers.Stack</span>
        <div className="relative">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white transition-all text-lg font-light leading-none"
          >
            +
          </button>
          
          {/* Add Layer Dropdown */}
          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
              <div className="absolute right-0 top-8 w-48 bg-slate-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50">
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
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
        {reversedElements.map((el, i) => (
          <div 
            key={el.id} 
            className={`
              p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all group
              ${activeElementId === el.id 
                ? 'bg-teal-500/15 border border-teal-500/30 shadow-[inset_0_0_15px_rgba(20,184,166,0.1)]' 
                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'}
            `}
            onClick={() => setActiveElement(el.id)}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm ${activeElementId === el.id ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                {TYPE_ICONS[el.objType]}
              </span>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold truncate w-32 ${activeElementId === el.id ? 'text-teal-50' : 'text-slate-300'}`}>
                  {el.name}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">{el.objType}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); removeElement(el.id) }} 
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors"
                title="Delete Layer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {elements.length === 0 && (
          <div className="text-center p-6 text-xs text-slate-600 font-medium">
            No layers. Add an element to start composing.
          </div>
        )}
      </div>
    </div>
  )
}
