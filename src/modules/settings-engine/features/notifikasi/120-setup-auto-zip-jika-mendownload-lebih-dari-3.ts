import type { SettingFeatureDefinition } from '../../types';
export const feature120: SettingFeatureDefinition = {
  id: '120',
  category: 'notifikasi',
  slug: 'setup-auto-zip-jika-mendownload-lebih-dari-3',
  label: 'Setup Auto-Zip jika mendownload lebih dari 3 file sekaligus',
  description: 'Konfigurasi mendalam untuk Setup Auto-Zip jika mendownload lebih dari 3 file sekaligus',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-120');
      } else {
        document.body.classList.remove('omni-engine-active-120');
      }
      localStorage.setItem('omni-toggle-120', String(!!value));
    }
  }
};
