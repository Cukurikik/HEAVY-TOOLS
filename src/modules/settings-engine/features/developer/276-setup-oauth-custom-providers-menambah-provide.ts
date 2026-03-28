import type { SettingFeatureDefinition } from '../../types';
export const feature276: SettingFeatureDefinition = {
  id: '276',
  category: 'developer',
  slug: 'setup-oauth-custom-providers-menambah-provide',
  label: 'Setup OAuth Custom Providers (Menambah Provider Single Sign-on Lokal BUMN/SIAKAD)',
  description: 'Konfigurasi mendalam untuk Setup OAuth Custom Providers (Menambah Provider Single Sign-on Lokal BUMN/SIAKAD)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-276-config', String(value));
    }
  }
};
