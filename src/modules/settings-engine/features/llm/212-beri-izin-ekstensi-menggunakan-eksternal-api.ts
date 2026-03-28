import type { SettingFeatureDefinition } from '../../types';
export const feature212: SettingFeatureDefinition = {
  id: '212',
  category: 'llm',
  slug: 'beri-izin-ekstensi-menggunakan-eksternal-api',
  label: 'Beri izin ekstensi menggunakan Eksternal API',
  description: 'Konfigurasi mendalam untuk Beri izin ekstensi menggunakan Eksternal API',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-212');
      } else {
        document.body.classList.remove('omni-engine-active-212');
      }
      localStorage.setItem('omni-toggle-212', String(!!value));
    }
  }
};
