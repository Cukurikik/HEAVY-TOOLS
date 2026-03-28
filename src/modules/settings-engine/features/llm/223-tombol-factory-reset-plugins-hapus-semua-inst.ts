import type { SettingFeatureDefinition } from '../../types';
export const feature223: SettingFeatureDefinition = {
  id: '223',
  category: 'llm',
  slug: 'tombol-factory-reset-plugins-hapus-semua-inst',
  label: 'Tombol "Factory Reset Plugins" (Hapus semua, install ulang bawaan)',
  description: 'Konfigurasi mendalam untuk Tombol "Factory Reset Plugins" (Hapus semua, install ulang bawaan)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-223');
      } else {
        document.body.classList.remove('omni-engine-active-223');
      }
      localStorage.setItem('omni-toggle-223', String(!!value));
    }
  }
};
