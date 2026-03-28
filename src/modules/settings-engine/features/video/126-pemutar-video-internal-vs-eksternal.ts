import type { SettingFeatureDefinition } from '../../types';
export const feature126: SettingFeatureDefinition = {
  id: '126',
  category: 'video',
  slug: 'pemutar-video-internal-vs-eksternal',
  label: 'Pemutar Video Internal vs Eksternal',
  description: 'Konfigurasi mendalam untuk Pemutar Video Internal vs Eksternal',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-126', String(value));
      localStorage.setItem('omni-dropdown-126', String(value));
    }
  }
};
