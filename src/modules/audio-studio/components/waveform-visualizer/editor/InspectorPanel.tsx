'use client'

import { useVisualizerStore, VisualizerElement, MeasureWhat } from '@/modules/audio-studio/store/useVisualizerStore'

export default function InspectorPanel() {
  const { elements, activeElementId, updateElement } = useVisualizerStore()
  
  const el = elements.find(e => e.id === activeElementId)

  if (!el) return (
    <div className="w-[320px] bg-[#0d0d12] border-l border-white/5 flex flex-col h-full text-sm text-slate-500 font-sans shadow-2xl z-10 items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-2xl">⚙️</div>
      <p className="font-bold text-white/80">Nothing Selected</p>
      <p className="text-xs mt-2 opacity-60">Select a layer from the Stack to inspect and tweak its properties.</p>
    </div>
  )
  
  // Helper to cast updates since TS struggles with Partial discriminated unions 
  const update = (updates: any) => updateElement(el.id, updates)

  return (
    <div className="w-[320px] bg-[#0d0d12] border-l border-white/5 flex flex-col h-full text-sm text-slate-300 font-sans shadow-2xl z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-black/20 sticky top-0 z-20 backdrop-blur-xl">
        <input 
          type="text" 
          value={el.name} 
          onChange={e => update({ name: e.target.value })}
          className="bg-transparent text-white font-black text-xl outline-none w-full focus:ring-2 focus:ring-teal-500/50 rounded px-1 -mx-1 transition-all"
        />
        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1.5 opacity-80">{el.objType} Node</p>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Base Transform */}
        <Section title="General Transform">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-semibold text-slate-400">Visibility</label>
            <label className="relative flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={el.visible} onChange={e => update({ visible: e.target.checked })} />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs font-semibold text-slate-400">Blend Mode</label>
            <select 
               value={el.blendMode}
               onChange={e => update({ blendMode: e.target.value })}
               className="bg-[#14141c] border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors"
            >
              <option value="Alpha">Alpha (Normal)</option>
              <option value="Screen">Screen (Glow)</option>
              <option value="Add">Add (Lighter)</option>
              <option value="Multiply">Multiply (Darken)</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Pos X" value={el.position.x} onChange={v => update({ position: { ...el.position, x: v } })} step={0.05} />
            <NumberInput label="Pos Y" value={el.position.y} onChange={v => update({ position: { ...el.position, y: v } })} step={0.05} />
            <NumberInput label="Scale X" value={el.scale.x} onChange={v => update({ scale: { ...el.scale, x: v } })} step={0.1} />
            <NumberInput label="Scale Y" value={el.scale.y} onChange={v => update({ scale: { ...el.scale, y: v } })} step={0.1} />
            <NumberInput label="Rotation" value={el.rotation} onChange={v => update({ rotation: v })} step={15} />
          </div>
        </Section>

        {/* Beat Reactivity */}
        <Section title="Beat Reactivity (Measure)">
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs font-semibold text-slate-400">Measure Scale</label>
            <select 
               value={el.measureScale.measureWhat}
               onChange={e => update({ measureScale: { ...el.measureScale, measureWhat: e.target.value as MeasureWhat } })}
               className="bg-[#14141c] border border-white/10 rounded-lg p-2.5 text-xs text-teal-300 font-semibold outline-none focus:border-teal-500 transition-colors"
            >
              <option value="Nothing">Nothing (Static)</option>
              <option value="Beat">Beat Range Expand</option>
              <option value="TotalTime">Time Continuous Rotation</option>
            </select>
          </div>
          
          {el.measureScale.measureWhat === 'Beat' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-teal-500/5 rounded-xl border border-teal-500/20">
              <NumberInput label="Beat Pwr X" value={el.measureScale.amountX} onChange={v => update({ measureScale: { ...el.measureScale, amountX: v } })} step={0.1} />
              <NumberInput label="Beat Pwr Y" value={el.measureScale.amountY} onChange={v => update({ measureScale: { ...el.measureScale, amountY: v } })} step={0.1} />
            </div>
          )}
        </Section>

        {/* Type Specific Fields */}
        <Section title="Node Properties">
          {renderSpecificProps(el, update)}
        </Section>
        
        <div className="h-20" /> {/* Bottom padding */}
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20,184,166,0.5); }
      `}}/>
    </div>
  )
}

function renderSpecificProps(el: VisualizerElement, update: (updates: any) => void) {
  switch (el.objType) {
    case 'Image':
      return (
        <div className="space-y-4">
          <TextInput label="Image URL" value={el.imageUrl} onChange={v => update({ imageUrl: v })} />
          
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Upload Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0])
                  update({ imageUrl: url })
                }
              }}
              className="text-xs text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20 cursor-pointer"
            />
          </div>

          <ColorInput label="Tint Color" value={el.color} onChange={v => update({ color: v })} />
          <NumberInput label="Opacity" value={el.opacity} onChange={v => update({ opacity: v })} step={0.1} />
        </div>
      )
    case 'Bars':
      return (
        <div className="space-y-4">
          <ColorInput label="Bars Color" value={el.color} onChange={v => update({ color: v })} />
          <NumberInput label="Bar Count" value={el.barCount} onChange={v => update({ barCount: v })} step={1} />
          <NumberInput label="Bar Width" value={el.barWidth} onChange={v => update({ barWidth: v })} step={1} />
          <NumberInput label="Roundness" value={el.roundness} onChange={v => update({ roundness: v })} step={1} />
        </div>
      )
    case 'Particles':
      return (
        <div className="space-y-4">
          <ColorInput label="Particle Color" value={el.color} onChange={v => update({ color: v })} />
          <NumberInput label="Particle Count" value={el.particleCount} onChange={v => update({ particleCount: v })} step={10} />
          <NumberInput label="Speed Multiplier" value={el.speedMultiplier} onChange={v => update({ speedMultiplier: v })} step={0.1} />
          <NumberInput label="Beat Explosion Pwr" value={el.beatExplosion} onChange={v => update({ beatExplosion: v })} step={0.5} />
        </div>
      )
    case 'MotionBlurEffect':
      return (
        <div className="space-y-4">
          <NumberInput label="Blur Trails" value={el.blurAmount} onChange={v => update({ blurAmount: v })} step={0.05} />
          <NumberInput label="RGB Aberration" value={el.rgbSplitAmount} onChange={v => update({ rgbSplitAmount: v })} step={0.05} />
        </div>
      )
    case 'RadialSpectrum':
      return (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Spectrum Mode</label>
            <select 
               value={(el as any).spectrumType || 'Bars'}
               onChange={e => update({ spectrumType: e.target.value })}
               className="bg-[#1a1a24] border border-white/5 rounded-lg p-2 text-xs text-white outline-none focus:border-teal-500 transition-colors"
            >
              <option value="Bars">Discrete Bars</option>
              <option value="Line">Continuous Wave Line</option>
            </select>
          </div>
          <ColorInput label="Spectrum Color" value={el.color} onChange={v => update({ color: v })} />
          <NumberInput label="Radius" value={el.radius} onChange={v => update({ radius: v })} step={5} />
          <NumberInput label="Density (Bar Count)" value={el.barCount} onChange={v => update({ barCount: v })} step={10} />
          <NumberInput label="Bar Width" value={(el as any).barWidth ?? 16} onChange={v => update({ barWidth: v })} step={1} />
          <NumberInput label="Roundness" value={(el as any).roundness ?? 8} onChange={v => update({ roundness: v })} step={1} />
          <NumberInput label="Rotation Speed" value={el.rotationSpeed} onChange={v => update({ rotationSpeed: v })} step={0.1} />
        </div>
      )
    default:
      return null
  }
}

// -- UI Helpers --

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{title}</h3>
      <div className="bg-white/[0.02] border border-white-5 rounded-xl p-4 shadow-sm">
        {children}
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange, step }: { label: string, value: number, onChange: (v: number) => void, step: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <input 
        type="number" 
        value={value} 
        step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="bg-[#1a1a24] border border-white/5 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-teal-500 transition-colors w-full"
      />
    </div>
  )
}

function TextInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="bg-[#1a1a24] border border-white/5 rounded-lg p-2 text-xs text-white outline-none focus:border-teal-500 transition-colors w-full"
      />
    </div>
  )
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2 items-center">
        <input 
          type="color" 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
        />
        <input 
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-[#1a1a24] border border-white/5 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-teal-500 transition-colors"
        />
      </div>
    </div>
  )
}
