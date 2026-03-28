import type { SettingFeatureDefinition } from '../../types';
export const feature019: SettingFeatureDefinition = {
  id: '019',
  category: 'tampilan',
  slug: 'tampilan-modal-popup-vs-full-screen-drawer',
  label: 'Tampilan Modal (Popup vs Full-Screen Drawer)',
  description: 'Konfigurasi mendalam untuk Tampilan Modal (Popup vs Full-Screen Drawer)',
  inputType: 'dropdown',
  options: ['Popup', 'Full-Screen Drawer'],
  defaultValue: 'Popup',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-019', String(value));
      localStorage.setItem('omni-dropdown-019', String(value));
    }
  }
};
