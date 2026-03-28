import type { SettingFeatureDefinition } from '../../types';
export const feature264: SettingFeatureDefinition = {
  id: '264',
  category: 'performa',
  slug: 'aktifkan-matikan-analytics-local',
  label: 'Aktifkan/Matikan Analytics Local',
  description: 'Konfigurasi mendalam untuk Aktifkan/Matikan Analytics Local',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-264');
      } else {
        document.body.classList.remove('omni-engine-active-264');
      }
      localStorage.setItem('omni-toggle-264', String(!!value));
    }
  }
};
