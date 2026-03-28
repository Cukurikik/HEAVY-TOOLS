import type { SettingFeatureDefinition } from '../../types';
export const feature155: SettingFeatureDefinition = {
  id: '155',
  category: 'audio',
  slug: 'notifikasi-warning-low-battery-saat-rendering',
  label: 'Notifikasi Warning Low Battery saat rendering berat',
  description: 'Konfigurasi mendalam untuk Notifikasi Warning Low Battery saat rendering berat',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-155');
      } else {
        document.body.classList.remove('omni-engine-active-155');
      }
      localStorage.setItem('omni-toggle-155', String(!!value));
    }
  }
};
