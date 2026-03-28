import type { SettingFeatureDefinition } from '../../types';
export const feature254: SettingFeatureDefinition = {
  id: '254',
  category: 'performa',
  slug: 'penghapusan-metadata-media-otomatis-saat-uplo',
  label: 'Penghapusan Metadata Media Otomatis Saat Upload (EXIF/GPS stripper)',
  description: 'Konfigurasi mendalam untuk Penghapusan Metadata Media Otomatis Saat Upload (EXIF/GPS stripper)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-254');
      } else {
        document.body.classList.remove('omni-engine-active-254');
      }
      localStorage.setItem('omni-toggle-254', String(!!value));
    }
  }
};
