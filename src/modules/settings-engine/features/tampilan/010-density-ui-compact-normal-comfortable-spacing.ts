import type { SettingFeatureDefinition } from '../../types';
export const feature010: SettingFeatureDefinition = {
  id: '010',
  category: 'tampilan',
  slug: 'density-ui-compact-normal-comfortable-spacing',
  label: 'Density UI (Compact, Normal, Comfortable spacing)',
  description: 'Konfigurasi mendalam untuk Density UI (Compact, Normal, Comfortable spacing)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-010');
      } else {
        document.body.classList.remove('omni-engine-active-010');
      }
      localStorage.setItem('omni-toggle-010', String(!!value));
    }
  }
};
