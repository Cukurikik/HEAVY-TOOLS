import type { SettingFeatureDefinition } from '../../types';
export const feature284: SettingFeatureDefinition = {
  id: '284',
  category: 'developer',
  slug: 'override-rate-limit-per-user-ip-address-dari',
  label: 'Override Rate Limit Per-User / IP Address dari UI Admin',
  description: 'Konfigurasi mendalam untuk Override Rate Limit Per-User / IP Address dari UI Admin',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-284-level', String(value));
      localStorage.setItem('omni-slider-284', String(value));
    }
  }
};
