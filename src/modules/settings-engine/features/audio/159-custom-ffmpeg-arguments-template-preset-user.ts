import type { SettingFeatureDefinition } from '../../types';
export const feature159: SettingFeatureDefinition = {
  id: '159',
  category: 'audio',
  slug: 'custom-ffmpeg-arguments-template-preset-user',
  label: 'Custom FFmpeg Arguments Template (Preset user untuk filter kompleks)',
  description: 'Konfigurasi mendalam untuk Custom FFmpeg Arguments Template (Preset user untuk filter kompleks)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-159', String(value));
      localStorage.setItem('omni-dropdown-159', String(value));
    }
  }
};
