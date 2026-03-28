'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, Mic, FileText, ArrowRightLeft, Bot, LayoutDashboard, Settings, PackageSearch, CheckCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOmniSetting } from '@/hooks/useOmniSetting';

const links = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Video Engine', href: '/video', icon: Video },
  { name: 'Audio Studio', href: '/audio', icon: Mic },
  { name: 'PDF Forge', href: '/pdf', icon: FileText },
  { name: 'Converters', href: '/converter', icon: ArrowRightLeft },
  { name: 'LLM Center', href: '/llm', icon: Bot },
  { name: 'Marketplace', href: '/plugins/marketplace', icon: PackageSearch },
  { name: 'My Plugins', href: '/plugins/installed', icon: CheckCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  // Read Global Settings Reatively
  const sidebarLayout = useOmniSetting<string>('pengaturan-layout-sidebar-expanded-collapsed', 'Expanded');
  const isAnimationDisabled = useOmniSetting<boolean>('toggle-animasi-ui-framer-motion-gsap-disable_enabled', false);
  const isCollapsed = sidebarLayout === 'Collapsed';

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <aside className={`fixed top-0 left-0 z-40 ${sidebarWidth} h-screen pt-20 transition-all duration-300 -translate-x-full bg-transparent border-r border-white/10 sm:translate-x-0 glass`}>
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <li key={link.name}>
                <Link href={link.href} className={cn(
                  "flex items-center p-3 rounded-lg group transition-all duration-300",
                  isActive ? "bg-white/10 text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white",
                  isCollapsed ? "justify-center" : ""
                )} title={isCollapsed ? link.name : undefined}>
                  <link.icon className={cn(
                    "w-6 h-6 transition-colors flex-shrink-0",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                  )} />
                  <span className={cn(
                    "ms-3 whitespace-nowrap transition-all duration-300",
                    isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                  )}>{link.name}</span>
                  {isActive && !isAnimationDisabled && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                  {isActive && isAnimationDisabled && (
                    <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
         <Link href="/settings" className={cn(
            "flex items-center p-3 text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-300",
            isCollapsed ? "justify-center" : ""
         )} title={isCollapsed ? "Settings" : undefined}>
            <Settings className="w-6 h-6 flex-shrink-0" />
            <span className={cn(
              "ms-3 whitespace-nowrap transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
            )}>Settings</span>
         </Link>
      </div>
    </aside>
  );
}
