"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Menu, Bell, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-[100] w-full backdrop-blur-2xl bg-slate-950/60 border-b border-white/5"
    >
      <div className="flex items-center justify-between px-8 py-5 max-w-[1800px] mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-none">OMNI-TOOL</span>
              <span className="text-[10px] font-black text-indigo-400 tracking-[0.3em] leading-none mt-1">ENTERPRISE</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavLink href="/video" label="Video" />
            <NavLink href="/audio" label="Audio" />
            <NavLink href="/image" label="Image" />
            <NavLink href="/pdf" label="PDF" />
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <button className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wider">SEARCH COMMANDS</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-mono">⌘K</span>
          </button>

          <div className="flex items-center gap-4">
            <IconButton icon={<Bell className="w-5 h-5" />} ariaLabel="Notifications" />
            <IconButton icon={<User className="w-5 h-5" />} ariaLabel="User Profile" />
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="text-xs font-black text-slate-400 hover:text-white tracking-widest uppercase transition-colors relative group">
      {label}
      <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function IconButton({ icon, ariaLabel }: { icon: React.ReactNode, ariaLabel: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {icon}
    </motion.button>
  );
}
