import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Log the API key availability for debugging during development
  if (mode === 'development') {
    console.log('Development mode:');
    console.log('ALIBABA_CLOUD_API_KEY available:', !!env.ALIBABA_CLOUD_API_KEY);
    console.log('GEMINI_API_KEY available:', !!env.GEMINI_API_KEY);
  }

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [],
    define: {
      'process.env.API_KEY': JSON.stringify(env.ALIBABA_CLOUD_API_KEY || env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.ALIBABA_CLOUD_API_KEY': JSON.stringify(env.ALIBABA_CLOUD_API_KEY),
      'global': 'globalThis'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});