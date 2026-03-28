import type { SettingFeatureDefinition } from '../../types';
export const feature038: SettingFeatureDefinition = {
  id: '038',
  category: 'keamanan',
  slug: 'tombol-log-out-all-other-sessions',
  label: 'Tombol "Log out all other sessions"',
  description: 'Konfigurasi mendalam untuk Tombol "Log out all other sessions"',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-038');
      } else {
        document.body.classList.remove('omni-engine-active-038');
      }
      localStorage.setItem('omni-toggle-038', String(!!value));
    }
  }
};
