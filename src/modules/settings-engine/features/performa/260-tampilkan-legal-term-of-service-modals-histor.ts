import type { SettingFeatureDefinition } from '../../types';
export const feature260: SettingFeatureDefinition = {
  id: '260',
  category: 'performa',
  slug: 'tampilkan-legal-term-of-service-modals-histor',
  label: 'Tampilkan Legal & Term of Service Modals History Review',
  description: 'Konfigurasi mendalam untuk Tampilkan Legal & Term of Service Modals History Review',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-260');
      } else {
        document.body.classList.remove('omni-engine-active-260');
      }
      localStorage.setItem('omni-toggle-260', String(!!value));
    }
  }
};
