import type { SettingFeatureDefinition } from '../../types';
export const feature013: SettingFeatureDefinition = {
  id: '013',
  category: 'tampilan',
  slug: 'efek-blur-glassmorphism-toggle-meningkatkan-f',
  label: 'Efek Blur/Glassmorphism Toggle (Meningkatkan FPS di PC kentang jika dimatikan)',
  description: 'Konfigurasi mendalam untuk Efek Blur/Glassmorphism Toggle (Meningkatkan FPS di PC kentang jika dimatikan)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-013');
      } else {
        document.body.classList.remove('omni-engine-active-013');
      }
      localStorage.setItem('omni-toggle-013', String(!!value));
    }
  }
};
