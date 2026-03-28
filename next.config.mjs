/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10gb',
    },
  },
  outputFileTracingRoot: process.cwd(),
  transpilePackages: ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-webgpu', '@imgly/background-removal'],
  serverExternalPackages: [
    'genkit',
    '@genkit-ai/core',
    '@genkit-ai/google-genai',
    '@opentelemetry/instrumentation',
    'require-in-the-middle',
    'express'
  ],

  // Turbopack config (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      // Stub out react-native-fs which jsmediatags tries to load in browser/SSR
      'react-native-fs': './empty-module.js',
    },
  },

  async headers() {
    return [
      {
        source: '/ffmpeg/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/models/audio/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/octet-stream' }
        ],
      },
      {
        source: '/models/pdf/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/wasm' }
        ],
      },
      {
        source: '/models/converter/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/wasm' }
        ],
      },
      {
        // ⚡ Native C++ WASM Modules (compiled via Emscripten)
        source: '/wasm/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/wasm' }
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; worker-src 'self' blob:; media-src 'self' blob: data: *; img-src 'self' blob: data: *; connect-src 'self' blob: data: *" },
          { key: 'Accept-Ranges', value: 'bytes' }
        ],
      },
    ];
  },
  // Webpack config (used when building with --webpack flag)
  webpack: (config, { isServer }) => {
    // Stub out react-native-fs which jsmediatags tries to load in browser/SSR
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native-fs': false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;