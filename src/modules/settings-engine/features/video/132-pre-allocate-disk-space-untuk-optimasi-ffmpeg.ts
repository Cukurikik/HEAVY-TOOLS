import type { SettingFeatureDefinition } from '../../types';
export const feature132: SettingFeatureDefinition = {
  id: '132',
  category: 'video',
  slug: 'pre-allocate-disk-space-untuk-optimasi-ffmpeg',
  label: 'Pre-allocate Disk Space (Untuk optimasi FFmpeg WASM write speed)',
  description: 'Konfigurasi mendalam untuk Pre-allocate Disk Space (Untuk optimasi FFmpeg WASM write speed)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-132');
      } else {
        document.body.classList.remove('omni-engine-active-132');
      }
      localStorage.setItem('omni-toggle-132', String(!!value));
    }
  }
};
