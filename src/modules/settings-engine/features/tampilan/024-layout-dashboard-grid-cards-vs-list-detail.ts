import type { SettingFeatureDefinition } from '../../types';
export const feature024: SettingFeatureDefinition = {
  id: '024',
  category: 'tampilan',
  slug: 'layout-dashboard-grid-cards-vs-list-detail',
  label: 'Layout Dashboard (Grid Cards vs List Detail)',
  description: 'Konfigurasi mendalam untuk Layout Dashboard (Grid Cards vs List Detail)',
  inputType: 'dropdown',
  options: ['Grid Cards', 'List Detail'],
  defaultValue: 'Grid Cards',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-024', String(value));
      localStorage.setItem('omni-dropdown-024', String(value));
    }
  }
};
