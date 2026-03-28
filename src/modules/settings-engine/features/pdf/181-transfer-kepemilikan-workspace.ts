import type { SettingFeatureDefinition } from '../../types';
export const feature181: SettingFeatureDefinition = {
  id: '181',
  category: 'pdf',
  slug: 'transfer-kepemilikan-workspace',
  label: 'Transfer Kepemilikan Workspace',
  description: 'Konfigurasi mendalam untuk Transfer Kepemilikan Workspace',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-181');
      } else {
        document.body.classList.remove('omni-engine-active-181');
      }
      localStorage.setItem('omni-toggle-181', String(!!value));
    }
  }
};
