import type { SettingFeatureDefinition } from '../../types';
export const feature283: SettingFeatureDefinition = {
  id: '283',
  category: 'developer',
  slug: 'rotasi-secret-key-jwt-secret-otomatis-cron-ba',
  label: 'Rotasi Secret Key / JWT Secret Otomatis (Cron based)',
  description: 'Konfigurasi mendalam untuk Rotasi Secret Key / JWT Secret Otomatis (Cron based)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-283-config', String(value));
    }
  }
};
