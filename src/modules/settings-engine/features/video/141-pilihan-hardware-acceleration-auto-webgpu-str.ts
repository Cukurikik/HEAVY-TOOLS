import type { SettingFeatureDefinition } from '../../types';
export const feature141: SettingFeatureDefinition = {
  id: '141',
  category: 'video',
  slug: 'pilihan-hardware-acceleration-auto-webgpu-str',
  label: 'Pilihan Hardware Acceleration (Auto, WebGPU Strict, WebGL Fallback)',
  description: 'Konfigurasi mendalam untuk Pilihan Hardware Acceleration (Auto, WebGPU Strict, WebGL Fallback)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-141', String(value));
      localStorage.setItem('omni-dropdown-141', String(value));
    }
  }
};
