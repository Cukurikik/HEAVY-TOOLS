'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PDF_TOOLS } from '../constants/tools';

export default function PdfForgeDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {PDF_TOOLS.map((tool, i) => {
        const IconComponent = tool.icon;
        return (
          <motion.div key={tool.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}>
            <Link href={tool.route} className="block group">
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg">{tool.name}</h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{tool.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tool.execution === 'client' ? 'bg-green-500/20 text-green-400' :
                    tool.execution === 'server' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {tool.execution === 'client' ? '⚡ Client' : tool.execution === 'server' ? '🖥️ Server' : '🔄 Hybrid'}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
