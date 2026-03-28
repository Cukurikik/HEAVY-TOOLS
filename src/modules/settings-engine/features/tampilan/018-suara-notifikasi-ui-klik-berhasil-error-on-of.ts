import type { SettingFeatureDefinition } from '../../types';
export const feature018: SettingFeatureDefinition = {
  id: '018',
  category: 'tampilan',
  slug: 'suara-notifikasi-ui-klik-berhasil-error-on-of',
  label: 'Suara Notifikasi UI (Klik, Berhasil, Error - On/Off/Volume)',
  description: 'Konfigurasi mendalam untuk Suara Notifikasi UI (Klik, Berhasil, Error - On/Off/Volume)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-018-level', String(value));
      localStorage.setItem('omni-slider-018', String(value));
    }
  }
};
