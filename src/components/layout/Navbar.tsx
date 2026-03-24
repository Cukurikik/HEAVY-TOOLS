'use client'

import React from 'react';
import Link from 'next/link';
import { User, Bell } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full glass">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg sm:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                   <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
             </button>
            <Link href="/" className="flex ms-2 md:me-24 items-center">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg mr-3 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap text-white tracking-tight">OMNI-TOOL</span>
            </Link>
          </div>
          <div className="flex items-center">
             <div className="flex items-center ms-3 space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5"/>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
