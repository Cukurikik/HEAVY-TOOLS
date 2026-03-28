import type { SettingFeatureDefinition } from '../../types';
export const feature187: SettingFeatureDefinition = {
  id: '187',
  category: 'pdf',
  slug: 'data-loss-prevention-dlp-settings-member-tida',
  label: 'Data Loss Prevention (DLP) Settings (Member tidak bisa eksport setting JSON)',
  description: 'Konfigurasi mendalam untuk Data Loss Prevention (DLP) Settings (Member tidak bisa eksport setting JSON)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-187');
      } else {
        document.body.classList.remove('omni-engine-active-187');
      }
      localStorage.setItem('omni-toggle-187', String(!!value));
    }
  }
};
