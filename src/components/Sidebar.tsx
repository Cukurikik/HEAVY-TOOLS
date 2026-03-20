"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Video, 
  Music, 
  Image as ImageIcon, 
  FileText, 
  Repeat, 
  Settings, 
  ShieldCheck,
  Zap,
  ChevronRight,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Anita Assistant", href: "/assistant", icon: Bot },
  { name: "Video Engine", href: "/video", icon: Video },
  { name: "Audio Studio", href: "/audio", icon: Music },
  { name: "Image Matrix", href: "/image", icon: ImageIcon },
  { name: "PDF Forge", href: "/pdf", icon: FileText },
  { name: "Converter", href: "/converter", icon: Repeat },
];

const secondaryLinks = [
  { name: "Governance", href: "/governance", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-72 h-[calc(100vh-81px)] border-r border-white/5 bg-slate-950/40 backdrop-blur-3xl p-8 sticky top-[81px] overflow-y-auto hidden lg:flex flex-col justify-between"
    >
      <div className="space-y-10">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Core Modules</h3>
          <div className="space-y-2">
            {links.map((link) => (
              <SidebarLink 
                key={link.name} 
                link={link} 
                isActive={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">System</h3>
          <div className="space-y-2">
            {secondaryLinks.map((link) => (
              <SidebarLink 
                key={link.name} 
                link={link} 
                isActive={pathname === link.href} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-white/5">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black text-white tracking-widest uppercase">Pro Engine</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-4">
              Unlock WebGPU acceleration and batch processing.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase hover:bg-indigo-400 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function SidebarLink({ link, isActive }: { link: any, isActive: boolean }) {
  return (
    <Link 
      href={link.href}
      className={cn(
        "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
        isActive 
          ? "bg-white/10 text-white shadow-xl shadow-black/20" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      {isActive && (
        <motion.div 
          layoutId="active-pill"
          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
        />
      )}
      <div className="flex items-center gap-4 relative z-10">
        <link.icon className={cn(
          "w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
          isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
        )} />
        <span className="text-xs font-black tracking-widest uppercase">{link.name}</span>
      </div>
      <ChevronRight className={cn(
        "w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1",
        isActive ? "text-indigo-400/50" : "text-slate-600"
      )} />
    </Link>
  );
}
