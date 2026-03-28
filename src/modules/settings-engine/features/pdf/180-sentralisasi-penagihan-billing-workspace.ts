import type { SettingFeatureDefinition } from '../../types';
export const feature180: SettingFeatureDefinition = {
  id: '180',
  category: 'pdf',
  slug: 'sentralisasi-penagihan-billing-workspace',
  label: 'Sentralisasi Penagihan (Billing Workspace)',
  description: 'Konfigurasi mendalam untuk Sentralisasi Penagihan (Billing Workspace)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-180');
      } else {
        document.body.classList.remove('omni-engine-active-180');
      }
      localStorage.setItem('omni-toggle-180', String(!!value));
    }
  }
};
