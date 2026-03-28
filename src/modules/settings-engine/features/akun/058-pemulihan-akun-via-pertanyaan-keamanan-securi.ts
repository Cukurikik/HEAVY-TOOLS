import type { SettingFeatureDefinition } from '../../types';
export const feature058: SettingFeatureDefinition = {
  id: '058',
  category: 'akun',
  slug: 'pemulihan-akun-via-pertanyaan-keamanan-securi',
  label: 'Pemulihan Akun via pertanyaan keamanan (Security Questions)',
  description: 'Konfigurasi mendalam untuk Pemulihan Akun via pertanyaan keamanan (Security Questions)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-058');
      } else {
        document.body.classList.remove('omni-engine-active-058');
      }
      localStorage.setItem('omni-toggle-058', String(!!value));
    }
  }
};
