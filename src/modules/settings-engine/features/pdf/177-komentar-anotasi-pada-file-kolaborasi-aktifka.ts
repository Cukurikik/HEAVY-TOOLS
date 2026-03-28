import type { SettingFeatureDefinition } from '../../types';
export const feature177: SettingFeatureDefinition = {
  id: '177',
  category: 'pdf',
  slug: 'komentar-anotasi-pada-file-kolaborasi-aktifka',
  label: 'Komentar & Anotasi pada File Kolaborasi (Aktifkan/Matikan)',
  description: 'Konfigurasi mendalam untuk Komentar & Anotasi pada File Kolaborasi (Aktifkan/Matikan)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-177');
      } else {
        document.body.classList.remove('omni-engine-active-177');
      }
      localStorage.setItem('omni-toggle-177', String(!!value));
    }
  }
};
