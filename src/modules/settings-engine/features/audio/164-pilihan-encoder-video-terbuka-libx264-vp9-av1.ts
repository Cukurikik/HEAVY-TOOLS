import type { SettingFeatureDefinition } from '../../types';
export const feature164: SettingFeatureDefinition = {
  id: '164',
  category: 'audio',
  slug: 'pilihan-encoder-video-terbuka-libx264-vp9-av1',
  label: 'Pilihan Encoder Video Terbuka (Libx264, VP9, AV1, H265)',
  description: 'Konfigurasi mendalam untuk Pilihan Encoder Video Terbuka (Libx264, VP9, AV1, H265)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-164', String(value));
      localStorage.setItem('omni-dropdown-164', String(value));
    }
  }
};
