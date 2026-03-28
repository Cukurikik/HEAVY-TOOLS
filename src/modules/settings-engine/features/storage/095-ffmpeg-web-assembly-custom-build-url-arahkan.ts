import type { SettingFeatureDefinition } from '../../types';
export const feature095: SettingFeatureDefinition = {
  id: '095',
  category: 'storage',
  slug: 'ffmpeg-web-assembly-custom-build-url-arahkan',
  label: 'FFmpeg Web Assembly Custom Build URL (Arahkan ke WASM modifan sendiri)',
  description: 'Konfigurasi mendalam untuk FFmpeg Web Assembly Custom Build URL (Arahkan ke WASM modifan sendiri)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-095-config', String(value));
    }
  }
};
