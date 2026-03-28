import type { SettingFeatureDefinition } from '../../types';
export const feature150: SettingFeatureDefinition = {
  id: '150',
  category: 'video',
  slug: 'tombol-clear-downloaded-ai-models',
  label: 'Tombol "Clear Downloaded AI Models"',
  description: 'Konfigurasi mendalam untuk Tombol "Clear Downloaded AI Models"',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-150');
      } else {
        document.body.classList.remove('omni-engine-active-150');
      }
      localStorage.setItem('omni-toggle-150', String(!!value));
    }
  }
};
