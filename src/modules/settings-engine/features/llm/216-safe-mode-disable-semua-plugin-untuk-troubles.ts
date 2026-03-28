import type { SettingFeatureDefinition } from '../../types';
export const feature216: SettingFeatureDefinition = {
  id: '216',
  category: 'llm',
  slug: 'safe-mode-disable-semua-plugin-untuk-troubles',
  label: 'Safe Mode (Disable semua plugin untuk troubleshooting)',
  description: 'Konfigurasi mendalam untuk Safe Mode (Disable semua plugin untuk troubleshooting)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-216', String(value));
      localStorage.setItem('omni-dropdown-216', String(value));
    }
  }
};
