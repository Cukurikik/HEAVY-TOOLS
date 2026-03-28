import type { SettingFeatureDefinition } from '../../types';
export const feature060: SettingFeatureDefinition = {
  id: '060',
  category: 'akun',
  slug: 'captcha-sensitivity-settings-untuk-form-publi',
  label: 'Captcha Sensitivity Settings (Untuk form public milik user)',
  description: 'Konfigurasi mendalam untuk Captcha Sensitivity Settings (Untuk form public milik user)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-060');
      } else {
        document.body.classList.remove('omni-engine-active-060');
      }
      localStorage.setItem('omni-toggle-060', String(!!value));
    }
  }
};
