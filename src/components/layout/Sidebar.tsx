'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, Mic, FileText, ArrowRightLeft, Bot, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Video Engine', href: '/video', icon: Video },
  { name: 'Audio Studio', href: '/audio', icon: Mic },
  { name: 'PDF Forge', href: '/pdf', icon: FileText },
  { name: 'Converters', href: '/converter', icon: ArrowRightLeft },
  { name: 'LLM Center', href: '/llm', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-transparent border-r border-white/10 sm:translate-x-0 glass">
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <li key={link.name}>
                <Link href={link.href} className={cn(
                  "flex items-center p-2 rounded-lg group transition-colors",
                  isActive ? "bg-white/10 text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"
                )}>
                  <link.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                  )} />
                  <span className="ms-3">{link.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
         <Link href="/settings" className="flex items-center p-2 text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="ms-3">Settings</span>
         </Link>
      </div>
    </aside>
  );
}
