import type { SettingFeatureDefinition } from '../../types';
export const feature249: SettingFeatureDefinition = {
  id: '249',
  category: 'plugin',
  slug: 'hapus-data-kartu-kredit-debit',
  label: 'Hapus Data Kartu Kredit/Debit',
  description: 'Konfigurasi mendalam untuk Hapus Data Kartu Kredit/Debit',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-249');
      } else {
        document.body.classList.remove('omni-engine-active-249');
      }
      localStorage.setItem('omni-toggle-249', String(!!value));
    }
  }
};
