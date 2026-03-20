"use client";

import { motion } from "framer-motion";
import { VIDEO_TOOLS } from "../constants/tools";
import Link from "next/link";
import {
  Scissors, Merge, RefreshCw, Minimize2, FlipHorizontal, RotateCw,
  Camera, History, FastForward, Repeat, Sliders, Image, Subtitles,
  Stamp, Wand2, Palette, Sparkles, Layers, Film, Sun, Moon,
  Timer, Monitor, Tag, ListChecks, Bookmark, Music,
  SplitSquareHorizontal, Maximize,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map string icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Merge, RefreshCw, Minimize2, FlipHorizontal, RotateCw,
  Camera, History, FastForward, Repeat, Sliders, Image, Subtitles,
  Stamp, Wand2, Palette, Sparkles, Layers, Film, Sun, Moon,
  Timer, Monitor, Tag, ListChecks, Bookmark, Music,
  SplitSquareHorizontal, Maximize,
  Turtle: Timer, // fallback
};

export function VideoEngineDashboard() {
  return (
    <div className="space-y-16 py-12">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
        >
          Omni-Tool Video Suite
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter"
        >
          VIDEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">TITAN</span> ENGINE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg md:text-xl leading-relaxed"
        >
          30 Professional tools for video manipulation, conversion, and enhancement.
          Powered by FFmpeg WASM for secure, client-side processing.
        </motion.p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {VIDEO_TOOLS.map((tool, index) => {
          const IconComponent = ICON_MAP[tool.icon] || Sparkles;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/video/${tool.id}`}
                className="group relative block p-8 h-full rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all backdrop-blur-xl overflow-hidden shadow-2xl"
              >
                {/* Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-500" />

                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg text-white`}>
                  <IconComponent className="w-8 h-8" />
                </div>

                <div className="relative space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>

                {/* Engine Badge */}
                <div className="mt-4 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {tool.engine}
                  </span>
                </div>

                {/* Action Indicator */}
                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
