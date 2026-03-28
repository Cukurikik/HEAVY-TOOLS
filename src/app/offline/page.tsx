'use client';

import Link from 'next/link';

export default function OfflineFallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full p-8 bg-card border border-border/50 rounded-3xl shadow-2xl text-center space-y-6 animate-fade-in relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
            <span className="text-4xl">📡</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
            Connection Lost
          </h1>
          
          <p className="text-muted-foreground">
            You are currently offline. Because Omni-Tool is designed as a Local-First WASM Architecture,
            many tools may still function utilizing your browser&apos;s Local Cache and OPFS.
          </p>

          <div className="pt-4 flex flex-col w-full gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Try Reconnecting
            </button>
            <Link 
              href="/"
              className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Return Home
            </Link>
          </div>
          
          <p className="text-xs text-zinc-600 mt-4">
            Error Code: ERR_INTERNET_DISCONNECTED_PWA_FALLBACK
          </p>
        </div>
      </div>
    </div>
  );
}
