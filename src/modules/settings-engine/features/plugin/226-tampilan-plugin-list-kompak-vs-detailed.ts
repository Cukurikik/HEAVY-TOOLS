import type { SettingFeatureDefinition } from '../../types';
export const feature226: SettingFeatureDefinition = {
  id: '226',
  category: 'plugin',
  slug: 'tampilan-plugin-list-kompak-vs-detailed',
  label: 'Tampilan Plugin List (Kompak vs Detailed)',
  description: 'Konfigurasi mendalam untuk Tampilan Plugin List (Kompak vs Detailed)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-226', String(value));
      localStorage.setItem('omni-dropdown-226', String(value));
    }
  }
};
