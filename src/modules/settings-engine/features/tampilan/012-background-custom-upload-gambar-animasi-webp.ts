import type { SettingFeatureDefinition } from '../../types';
export const feature012: SettingFeatureDefinition = {
  id: '012',
  category: 'tampilan',
  slug: 'background-custom-upload-gambar-animasi-webp',
  label: 'Background Custom (Upload gambar/animasi WEBP untuk background app)',
  description: 'Konfigurasi mendalam untuk Background Custom (Upload gambar/animasi WEBP untuk background app)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-012-config', String(value));
    }
  }
};
