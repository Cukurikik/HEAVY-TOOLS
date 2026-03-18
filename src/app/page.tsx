"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold tracking-tight text-white mb-6">
          OMNI-TOOL <span className="text-emerald-500">NEXT.JS</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          LAPOR KAPTEN! Sistem telah berhasil dimigrasi dari Angular ke Next.js.
          Seluruh arsitektur Hybrid-Online Enterprise Suite siap beroperasi di Phase 19!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard 
            title="Video Titan Engine" 
            desc="FFmpeg WASM v0.12.6 Ready" 
            icon="🎬"
          />
          <FeatureCard 
            title="Audio Studio" 
            desc="Offline Audio Context" 
            icon="🎵"
          />
          <FeatureCard 
            title="Image Matrix" 
            desc="WebGPU & Canvas API" 
            icon="🖼️"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-colors"
        >
          GAS PULL!!
        </motion.button>
      </motion.div>
    </main>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-sm"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </motion.div>
  );
}
