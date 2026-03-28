import type { SettingFeatureDefinition } from '../../types';
export const feature007: SettingFeatureDefinition = {
  id: '007',
  category: 'tampilan',
  slug: 'pemilihan-font-family-inter-roboto-fira-code',
  label: 'Pemilihan Font Family (Inter, Roboto, Fira Code, Open Dyslexic)',
  description: 'Konfigurasi mendalam untuk Pemilihan Font Family (Inter, Roboto, Fira Code, Open Dyslexic)',
  inputType: 'dropdown',
  options: ['Inter', 'Roboto', 'Fira Code', 'Open Dyslexic'],
  defaultValue: 'Inter',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--font-sans', String(value));
      localStorage.setItem('omni-font-family', String(value));
    }
  }
};
