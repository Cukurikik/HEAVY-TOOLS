import type { SettingFeatureDefinition } from '../../types';
export const feature005: SettingFeatureDefinition = {
  id: '005',
  category: 'tampilan',
  slug: 'toggle-animasi-ui-framer-motion-gsap-disable',
  label: 'Toggle Animasi UI (Framer Motion / GSAP Disable untuk performa raw)',
  description: 'Konfigurasi mendalam untuk Toggle Animasi UI (Framer Motion / GSAP Disable untuk performa raw)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-005');
      } else {
        document.body.classList.remove('omni-engine-active-005');
      }
      localStorage.setItem('omni-toggle-005', String(!!value));
    }
  }
};
