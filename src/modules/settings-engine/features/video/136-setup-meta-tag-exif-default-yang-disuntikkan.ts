import type { SettingFeatureDefinition } from '../../types';
export const feature136: SettingFeatureDefinition = {
  id: '136',
  category: 'video',
  slug: 'setup-meta-tag-exif-default-yang-disuntikkan',
  label: 'Setup Meta Tag / EXIF default yang disuntikkan ke setiap media hasil render',
  description: 'Konfigurasi mendalam untuk Setup Meta Tag / EXIF default yang disuntikkan ke setiap media hasil render',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-136');
      } else {
        document.body.classList.remove('omni-engine-active-136');
      }
      localStorage.setItem('omni-toggle-136', String(!!value));
    }
  }
};
