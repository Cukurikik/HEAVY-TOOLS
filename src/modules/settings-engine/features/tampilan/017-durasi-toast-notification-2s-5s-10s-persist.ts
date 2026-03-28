import type { SettingFeatureDefinition } from '../../types';
export const feature017: SettingFeatureDefinition = {
  id: '017',
  category: 'tampilan',
  slug: 'durasi-toast-notification-2s-5s-10s-persist',
  label: 'Durasi Toast Notification (2s, 5s, 10s, Persist)',
  description: 'Konfigurasi mendalam untuk Durasi Toast Notification (2s, 5s, 10s, Persist)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-017-level', String(value));
      localStorage.setItem('omni-slider-017', String(value));
    }
  }
};
