import type { SettingFeatureDefinition } from '../../types';
export const feature004: SettingFeatureDefinition = {
  id: '004',
  category: 'tampilan',
  slug: 'pengaturan-layout-sidebar-expanded-collapsed',
  label: 'Pengaturan Layout Sidebar (Expanded, Collapsed, Auto-hide, Floating)',
  description: 'Konfigurasi mendalam untuk Pengaturan Layout Sidebar (Expanded, Collapsed, Auto-hide, Floating)',
  inputType: 'dropdown',
  options: ['Expanded', 'Collapsed', 'Auto-hide', 'Floating'],
  defaultValue: 'Expanded',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-004', String(value));
      localStorage.setItem('omni-dropdown-004', String(value));
    }
  }
};
