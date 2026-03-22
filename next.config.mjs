/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
    ];
  },
  webpack(config) {
    // Ensure resolve.fallback exists and set Node.js polyfills to false
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      crypto: false,
      'react-native-fs': false
    };
    
    // Ensure experiments exists before spreading
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
      layers: true
    };
    
    // Check if similar rule already exists to avoid duplication
    const jsRuleExists = config.module.rules.some(
      rule => rule.test && rule.test.toString().includes('\\.m?js$')
    );
    
    if (!jsRuleExists) {
      config.module.rules.push({
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: { fullySpecified: false },
      });
    }
    
    return config;
  },
};

export default nextConfig;