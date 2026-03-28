import type { SettingFeatureDefinition } from '../../types';
export const feature052: SettingFeatureDefinition = {
  id: '052',
  category: 'akun',
  slug: 'pembatasan-ip-access-whitelist-ip-tertentu-un',
  label: 'Pembatasan IP Access (Whitelist IP tertentu untuk login)',
  description: 'Konfigurasi mendalam untuk Pembatasan IP Access (Whitelist IP tertentu untuk login)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-052-level', String(value));
      localStorage.setItem('omni-slider-052', String(value));
    }
  }
};
