"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { converterTools } from "../constants/tools";
import Link from "next/link";
import { useState, useMemo } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function ConverterDashboard() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return converterTools;
    const q = search.toLowerCase();
    return converterTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search 30 converter tools..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 backdrop-blur-md transition-all"
        />
      </div>

      {/* Tool Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {filtered.map((tool) => (
          <motion.div key={tool.id} variants={cardVariants}>
            <Link href={`/converter/${tool.id}`} className="block group">
              <div className="relative h-full p-5 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1">
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}
                />

                <div className="relative z-10 space-y-3">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <tool.icon className="w-5.5 h-5.5 text-white" />
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Execution badge */}
                  <span
                    className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      tool.executionType === "client"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : tool.executionType === "server"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-blue-500/15 text-blue-400"
                    }`}
                  >
                    {tool.executionType === "client" ? "⚡ Local" : tool.executionType === "server" ? "☁️ Cloud" : "🔄 Hybrid"}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-slate-400 text-lg font-medium">
            No converter tools match &quot;{search}&quot;
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline underline-offset-4"
          >
            Clear search
          </button>
        </motion.div>
      )}
    </div>
  );
}
