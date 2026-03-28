import type { SettingFeatureDefinition } from '../../types';
export const feature151: SettingFeatureDefinition = {
  id: '151',
  category: 'audio',
  slug: 'pilihan-node-server-processing-vs-local-wasm',
  label: 'Pilihan Node Server Processing vs Local WASM Processing',
  description: 'Konfigurasi mendalam untuk Pilihan Node Server Processing vs Local WASM Processing',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-151', String(value));
      localStorage.setItem('omni-dropdown-151', String(value));
    }
  }
};
