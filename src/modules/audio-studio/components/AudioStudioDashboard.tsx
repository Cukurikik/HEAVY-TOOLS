"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AUDIO_TOOLS } from "../constants/tools";
import { ArrowRight } from "lucide-react";

export function AudioStudioDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {AUDIO_TOOLS.map((tool, i) => {
        const IconComponent = tool.icon;
        return (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, type: "spring", stiffness: 100 }}
          >
            <Link
              href={`/audio/${tool.id}`}
              className="group relative block p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
              <div className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <IconComponent className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 group-hover:text-violet-300 transition-colors">{tool.name}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
              <div className="mt-4 flex items-center text-violet-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
