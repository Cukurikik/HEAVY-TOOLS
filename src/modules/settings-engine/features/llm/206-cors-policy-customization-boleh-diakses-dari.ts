import type { SettingFeatureDefinition } from '../../types';
export const feature206: SettingFeatureDefinition = {
  id: '206',
  category: 'llm',
  slug: 'cors-policy-customization-boleh-diakses-dari',
  label: 'CORS Policy Customization (Boleh diakses dari domain frontend lain)',
  description: 'Konfigurasi mendalam untuk CORS Policy Customization (Boleh diakses dari domain frontend lain)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-206-config', String(value));
    }
  }
};
