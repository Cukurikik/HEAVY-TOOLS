import type { SettingFeatureDefinition } from '../../types';
export const feature133: SettingFeatureDefinition = {
  id: '133',
  category: 'video',
  slug: 'chunking-size-untuk-upload-multipart-ke-cloud',
  label: 'Chunking Size untuk Upload Multipart ke Cloud (Default 5MB)',
  description: 'Konfigurasi mendalam untuk Chunking Size untuk Upload Multipart ke Cloud (Default 5MB)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-133-level', String(value));
      localStorage.setItem('omni-slider-133', String(value));
    }
  }
};
