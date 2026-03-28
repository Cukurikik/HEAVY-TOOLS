import type { SettingFeatureDefinition } from '../../types';
export const feature020: SettingFeatureDefinition = {
  id: '020',
  category: 'tampilan',
  slug: 'breadcrumbs-navigation-toggle',
  label: 'Breadcrumbs Navigation Toggle',
  description: 'Konfigurasi mendalam untuk Breadcrumbs Navigation Toggle',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-020');
      } else {
        document.body.classList.remove('omni-engine-active-020');
      }
      localStorage.setItem('omni-toggle-020', String(!!value));
    }
  }
};
