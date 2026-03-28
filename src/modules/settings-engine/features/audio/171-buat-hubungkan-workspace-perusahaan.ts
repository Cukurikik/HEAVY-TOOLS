import type { SettingFeatureDefinition } from '../../types';
export const feature171: SettingFeatureDefinition = {
  id: '171',
  category: 'audio',
  slug: 'buat-hubungkan-workspace-perusahaan',
  label: 'Buat / Hubungkan Workspace Perusahaan',
  description: 'Konfigurasi mendalam untuk Buat / Hubungkan Workspace Perusahaan',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-171');
      } else {
        document.body.classList.remove('omni-engine-active-171');
      }
      localStorage.setItem('omni-toggle-171', String(!!value));
    }
  }
};
