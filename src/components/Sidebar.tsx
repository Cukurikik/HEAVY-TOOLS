"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Video Engine", href: "/video" },
  { name: "Audio Studio", href: "/audio" },
  { name: "Image Matrix", href: "/image" },
  { name: "PDF Forge", href: "/pdf" },
  { name: "Converter", href: "/converter" },
];

export default function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-[calc(100vh-73px)] border-r border-slate-800 bg-slate-950/50 backdrop-blur-sm p-6 sticky top-[73px] overflow-y-auto hidden md:block"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Modules</h3>
        {links.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </motion.aside>
  );
}
