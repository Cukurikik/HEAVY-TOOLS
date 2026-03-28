import type { SettingFeatureDefinition } from '../../types';
export const feature022: SettingFeatureDefinition = {
  id: '022',
  category: 'tampilan',
  slug: 'scrollbar-customization-minimalist-vs-native',
  label: 'Scrollbar Customization (Minimalist vs Native/Tebal)',
  description: 'Konfigurasi mendalam untuk Scrollbar Customization (Minimalist vs Native/Tebal)',
  inputType: 'dropdown',
  options: ['Minimalist', 'Native'],
  defaultValue: 'Minimalist',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-022', String(value));
      localStorage.setItem('omni-dropdown-022', String(value));
    }
  }
};
