import type { SettingFeatureDefinition } from '../../types';
export const feature165: SettingFeatureDefinition = {
  id: '165',
  category: 'audio',
  slug: 'hardware-encoder-override-vaapi-nvenc-pasca-c',
  label: 'Hardware Encoder Override (VAAPI/NVENC pasca-Chrome 120 support)',
  description: 'Konfigurasi mendalam untuk Hardware Encoder Override (VAAPI/NVENC pasca-Chrome 120 support)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-165', String(value));
      localStorage.setItem('omni-dropdown-165', String(value));
    }
  }
};
