import type { SettingFeatureDefinition } from '../../types';
export const feature050: SettingFeatureDefinition = {
  id: '050',
  category: 'keamanan',
  slug: 'hapus-akun-permanen-gdrp-right-to-be-forgotte',
  label: 'Hapus Akun Permanen (GDRP Right to be Forgotten)',
  description: 'Konfigurasi mendalam untuk Hapus Akun Permanen (GDRP Right to be Forgotten)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-050');
      } else {
        document.body.classList.remove('omni-engine-active-050');
      }
      localStorage.setItem('omni-toggle-050', String(!!value));
    }
  }
};
