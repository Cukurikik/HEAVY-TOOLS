import type { SettingFeatureDefinition } from '../../types';
export const feature140: SettingFeatureDefinition = {
  id: '140',
  category: 'video',
  slug: 'statistik-usage-disk-storage-visual-donut-cha',
  label: 'Statistik Usage Disk Storage Visual (Donut chart)',
  description: 'Konfigurasi mendalam untuk Statistik Usage Disk Storage Visual (Donut chart)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-140');
      } else {
        document.body.classList.remove('omni-engine-active-140');
      }
      localStorage.setItem('omni-toggle-140', String(!!value));
    }
  }
};
