import type { SettingFeatureDefinition } from '../../types';
export const feature162: SettingFeatureDefinition = {
  id: '162',
  category: 'audio',
  slug: 'gpu-vendor-specific-optimizations-nvidia-vs-a',
  label: 'GPU Vendor Specific Optimizations (Nvidia vs AMD vs Apple Silicon)',
  description: 'Konfigurasi mendalam untuk GPU Vendor Specific Optimizations (Nvidia vs AMD vs Apple Silicon)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-162', String(value));
      localStorage.setItem('omni-dropdown-162', String(value));
    }
  }
};
