"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Play, Music, Image as ImageIcon, Zap, Shield, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-indigo-400 text-xs font-black uppercase tracking-[0.2em] shadow-2xl"
          >
            Phase 19: UI/UX Masterpiece
          </motion.div>

          {/* Hero Title */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9]"
            >
              OMNI-TOOL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500">
                ENTERPRISE
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              The ultimate hybrid-online suite for professional media manipulation. 
              Local-first performance with cloud-optional synchronization.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link href="/video">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg shadow-2xl shadow-white/10 flex items-center space-x-3 transition-all"
              >
                <span>LAUNCH ENGINE</span>
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </Link>
            <button className="px-10 py-5 bg-slate-900/80 border border-white/10 text-white rounded-2xl font-black text-lg backdrop-blur-xl hover:bg-slate-800 transition-all">
              DOCUMENTATION
            </button>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl pt-20">
            <FeatureCard 
              title="Video Titan" 
              desc="30+ Tools powered by FFmpeg WASM v0.12.6" 
              icon={<Play className="w-8 h-8" />}
              color="text-indigo-400"
              delay={0.6}
            />
            <FeatureCard 
              title="Audio Studio" 
              desc="High-fidelity Offline Audio Context rendering" 
              icon={<Music className="w-8 h-8" />}
              color="text-purple-400"
              delay={0.7}
            />
            <FeatureCard 
              title="Image Matrix" 
              desc="WebGPU accelerated filters & AI upscaling" 
              icon={<ImageIcon className="w-8 h-8" />}
              color="text-emerald-400"
              delay={0.8}
            />
          </div>

          {/* Stats/Trust */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-12 pt-20 border-t border-white/5 w-full"
          >
            <StatItem icon={<Zap className="w-5 h-5" />} label="Zero Latency" />
            <StatItem icon={<Shield className="w-5 h-5" />} label="Local Encryption" />
            <StatItem icon={<Cpu className="w-5 h-5" />} label="WebGPU Ready" />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, desc, icon, color, delay }: { title: string, desc: string, icon: React.ReactNode, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="group p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-all duration-1000" />
      <div className={`p-4 rounded-2xl bg-slate-800/80 w-fit mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StatItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center space-x-3 text-slate-500 font-black text-xs uppercase tracking-widest">
      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
        {icon}
      </div>
      <span>{label}</span>
    </div>
  );
}
