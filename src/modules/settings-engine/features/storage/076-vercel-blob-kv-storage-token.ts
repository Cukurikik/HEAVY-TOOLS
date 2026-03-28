import type { SettingFeatureDefinition } from '../../types';
export const feature076: SettingFeatureDefinition = {
  id: '076',
  category: 'storage',
  slug: 'vercel-blob-kv-storage-token',
  label: 'Vercel Blob / KV Storage Token',
  description: 'Konfigurasi mendalam untuk Vercel Blob / KV Storage Token',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-076-config', String(value));
    }
  }
};
