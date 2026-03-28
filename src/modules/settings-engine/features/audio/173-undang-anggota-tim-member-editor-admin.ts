import type { SettingFeatureDefinition } from '../../types';
export const feature173: SettingFeatureDefinition = {
  id: '173',
  category: 'audio',
  slug: 'undang-anggota-tim-member-editor-admin',
  label: 'Undang Anggota Tim (Member, Editor, Admin)',
  description: 'Konfigurasi mendalam untuk Undang Anggota Tim (Member, Editor, Admin)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-173');
      } else {
        document.body.classList.remove('omni-engine-active-173');
      }
      localStorage.setItem('omni-toggle-173', String(!!value));
    }
  }
};
