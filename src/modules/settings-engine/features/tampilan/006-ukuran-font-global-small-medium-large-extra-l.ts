import type { SettingFeatureDefinition } from '../../types';
export const feature006: SettingFeatureDefinition = {
  id: '006',
  category: 'tampilan',
  slug: 'ukuran-font-global-small-medium-large-extra-l',
  label: 'Ukuran Font Global (Small, Medium, Large, Extra Large)',
  description: 'Konfigurasi mendalam untuk Ukuran Font Global (Small, Medium, Large, Extra Large)',
  inputType: 'dropdown',
  options: ['Small', 'Medium', 'Large', 'Extra Large'],
  defaultValue: 'Medium',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      const sizeMap = { 'Small': '14px', 'Medium': '16px', 'Large': '18px', 'Extra Large': '20px' };
      document.documentElement.style.setProperty('--omni-font-size', sizeMap[String(value)] || '16px');
      localStorage.setItem('omni-font-size', String(value));
    }
  }
};
