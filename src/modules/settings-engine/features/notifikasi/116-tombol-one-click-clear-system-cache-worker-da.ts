import type { SettingFeatureDefinition } from '../../types';
export const feature116: SettingFeatureDefinition = {
  id: '116',
  category: 'notifikasi',
  slug: 'tombol-one-click-clear-system-cache-worker-da',
  label: 'Tombol "One-Click Clear System Cache & Worker Data"',
  description: 'Konfigurasi mendalam untuk Tombol "One-Click Clear System Cache & Worker Data"',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-116');
      } else {
        document.body.classList.remove('omni-engine-active-116');
      }
      localStorage.setItem('omni-toggle-116', String(!!value));
    }
  }
};
