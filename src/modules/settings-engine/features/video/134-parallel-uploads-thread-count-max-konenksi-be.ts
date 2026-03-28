import type { SettingFeatureDefinition } from '../../types';
export const feature134: SettingFeatureDefinition = {
  id: '134',
  category: 'video',
  slug: 'parallel-uploads-thread-count-max-konenksi-be',
  label: 'Parallel Uploads Thread Count (Max konenksi bersamaan saat upload, misal: 4)',
  description: 'Konfigurasi mendalam untuk Parallel Uploads Thread Count (Max konenksi bersamaan saat upload, misal: 4)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-134-level', String(value));
      localStorage.setItem('omni-slider-134', String(value));
    }
  }
};
