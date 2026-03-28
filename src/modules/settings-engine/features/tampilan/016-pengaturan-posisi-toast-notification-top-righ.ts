import type { SettingFeatureDefinition } from '../../types';
export const feature016: SettingFeatureDefinition = {
  id: '016',
  category: 'tampilan',
  slug: 'pengaturan-posisi-toast-notification-top-righ',
  label: 'Pengaturan Posisi Toast Notification (Top-Right, Bottom-Center, dll)',
  description: 'Konfigurasi mendalam untuk Pengaturan Posisi Toast Notification (Top-Right, Bottom-Center, dll)',
  inputType: 'dropdown',
  options: ['Top-Right', 'Top-Left', 'Bottom-Right', 'Bottom-Center'],
  defaultValue: 'Top-Right',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-016', String(value));
      localStorage.setItem('omni-dropdown-016', String(value));
    }
  }
};
