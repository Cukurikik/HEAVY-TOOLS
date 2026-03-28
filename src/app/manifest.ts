/**
 * Mobile PWA Manifest - Next.js 15+ App Router
 * Phase 20 (Deep OS Integration)
 * 
 * Provides native installation prompts on Android, iOS, and Windows.
 * Configured with deep-link shortcuts to immediately launch high-usage tools
 * bypassing the home dashboard.
 */

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omni-Tool Enterprise Suite',
    short_name: 'Omni-Tool',
    description: 'The Ultimate AI, Audio, Video, & PDF Local Processing Suite. 300+ Tools running strictly on WebAssembly.',
    start_url: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'minimal-ui'],
    background_color: '#09090b',  // Zinc-950 Tailwind
    theme_color: '#ec4899',       // Pink-500 Tailwind Main
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    // Native Desktop/Mobile App Shortcuts (Long Press App Icon to activate)
    shortcuts: [
      {
        name: 'Video Engine',
        short_name: 'Video',
        description: 'Launch the FFmpeg WASM Video Hub',
        url: '/video',
        icons: [{ src: '/icons/shortcut-video.png', sizes: '192x192' }]
      },
      {
        name: 'Audio Studio',
        short_name: 'Audio',
        description: 'Launch the Multi-Track Audio Matrix',
        url: '/audio',
        icons: [{ src: '/icons/shortcut-audio.png', sizes: '192x192' }]
      },
      {
        name: 'AI & LLMs',
        short_name: 'AI Chat',
        description: 'Open the Local ONNX Inference Engine',
        url: '/llm',
        icons: [{ src: '/icons/shortcut-ai.png', sizes: '192x192' }]
      },
      {
        name: 'Settings Hub',
        short_name: 'Settings',
        description: 'Configure Core Engine Parameters',
        url: '/settings',
        icons: [{ src: '/icons/shortcut-settings.png', sizes: '192x192' }]
      }
    ],
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://omni-tool.com/manifest.webmanifest'
      }
    ]
  };
}
