import type { SettingFeatureDefinition } from '../../types';
export const feature262: SettingFeatureDefinition = {
  id: '262',
  category: 'performa',
  slug: 'masking-nomor-hp-pii-pada-layar-dashboard-blu',
  label: 'Masking Nomor HP / PII pada layar / dashboard (Blur by default)',
  description: 'Konfigurasi mendalam untuk Masking Nomor HP / PII pada layar / dashboard (Blur by default)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-262');
      } else {
        document.body.classList.remove('omni-engine-active-262');
      }
      localStorage.setItem('omni-toggle-262', String(!!value));
    }
  }
};
