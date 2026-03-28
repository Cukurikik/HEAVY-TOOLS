import type { SettingFeatureDefinition } from '../../types';
export const feature049: SettingFeatureDefinition = {
  id: '049',
  category: 'keamanan',
  slug: 'export-private-key-e2e-pem',
  label: 'Export Private Key E2E (.pem)',
  description: 'Konfigurasi mendalam untuk Export Private Key E2E (.pem)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-049');
      } else {
        document.body.classList.remove('omni-engine-active-049');
      }
      localStorage.setItem('omni-toggle-049', String(!!value));
    }
  }
};
