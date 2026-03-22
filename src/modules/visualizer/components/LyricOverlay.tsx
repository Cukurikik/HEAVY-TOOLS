'use client'

import { useVisualizerStore } from '@/modules/visualizer/store/useVisualizerStore'

interface Props {
  currentTime: number
}

export default function LyricOverlay({ currentTime }: Props) {
  const { lyrics } = useVisualizerStore()
  
  if (!lyrics || lyrics.length === 0) return null

  // Find the current active line
  let activeIndex = -1
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i
    } else {
      break
    }
  }

  const currentLine = activeIndex >= 0 ? lyrics[activeIndex].text : ''
  const nextLine = activeIndex >= 0 && activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1].text : ''

  return (
    <div className="absolute top-[60%] left-0 right-0 pointer-events-none z-30 flex flex-col items-center justify-center transform -translate-y-1/2">
       <div 
         className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center leading-tight tracking-wider px-8" 
         style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(20, 184, 166, 0.4)' }}
       >
          {currentLine}
       </div>
       {nextLine && (
         <div 
           className="text-xl md:text-2xl font-bold text-white/40 text-center mt-6 px-8"
           style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
         >
            {nextLine}
         </div>
       )}
    </div>
  )
}
